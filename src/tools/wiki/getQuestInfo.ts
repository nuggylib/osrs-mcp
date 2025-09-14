import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { JSDOM } from 'jsdom'

import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';
import { loadPrompt } from '../../utils/promptLoader.js';
import { createOSRSWikiAPIAction } from '../../utils/osrsWikiAPIActionFactory.js';
import { SUPPORTED_API_ACTIONS, SUPPORTED_PARSETREE_TEMPLATE_TITLE, QuestDetailsTemplate, InfoboxQuestTemplate } from '../../types/osrsWiki.js';
import { extractTemplatesFromXML as extractTemplatesFromXML } from '../../utils/wikimedia/extractTemplatesFromXML.js';
import { findTemplates } from '../../utils/templateHelpers.js';
import { QuestInfoToolResponse } from '../../zod';
import { QuestInfoToolResponseType } from '../../types/osrsMcp.js';
import { getRequiredItems, getRequiredQuests, getRequiredSkills, getRecommendedItems, getRecommendedSkills, getEnemiesToKill } from '../../workflows/quest/index.js';
import { getReleaseParts } from '../../workflows/quest/getReleaseParts.js';

export async function getQuestInfo(
	questName: string,
): Promise<CallToolResult> {
	const questInfoToolResponse: Partial<QuestInfoToolResponseType> = {}
	const parseActionParseTree = createOSRSWikiAPIAction<string>(SUPPORTED_API_ACTIONS.EXPANDTEMPLATES, {
		page: questName,
		prop: 'parsetree',
	}, 'xml')

	const parseTreeResponse = await parseActionParseTree({})
	const parseTreeJsDOM = new JSDOM(parseTreeResponse.data)
	const parsedTemplates = extractTemplatesFromXML(parseTreeJsDOM)

	const questDetailsTemplate = findTemplates<QuestDetailsTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.QUEST_DETAILS)[0]
	const infoboxQuestTemplate = findTemplates<InfoboxQuestTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.INFOBOX_QUEST)[0]

	const { start, startmap, difficulty, length, requirements, recommended, kills } = questDetailsTemplate.parameters

	server.server.sendLoggingMessage({
		level: 'debug',
		data: questDetailsTemplate,
	})

	// TODO: Parse this differently to store the X and Y individually for easier use.
	questInfoToolResponse.startingPoint = startmap
	questInfoToolResponse.difficulty = difficulty
	questInfoToolResponse.length = length

	// Parse `start` for the questGiver (pattern is generally "Speak/Talk to [[NPC_NAME]] at/in..." followed by location)
	const questGiverMatch = start.match(/(?:Speak|Talk)\s+(?:to|with)\s+\[\[([^\]]+)\]\]/i)
	if (questGiverMatch) {
		// Extract the NPC name, handling cases where it might have a pipe for display text
		const npcNameRaw = questGiverMatch[1]
		// If there's a pipe, the actual NPC name is before it
		questInfoToolResponse.questGiver = npcNameRaw.split('|')[0].trim()
	}

	if (requirements) {
		questInfoToolResponse.requiredItems = getRequiredItems(requirements)
		questInfoToolResponse.requiredQuests = getRequiredQuests(requirements)
		questInfoToolResponse.requiredSkills = getRequiredSkills(requirements)
	}

	if (recommended) {
		questInfoToolResponse.recommendedItems = getRecommendedItems(recommended)
		questInfoToolResponse.recommendedSkills = getRecommendedSkills(recommended)
		// TODO: Travel recommendations (e.g., fairy rings, glider paths, gnome tree usage, etc.)
	}

	if (kills) {
		questInfoToolResponse.enemiesToDefeat = getEnemiesToKill(kills)
	}

	const { name, number, image, release, update, aka, members, series, developer } = infoboxQuestTemplate.parameters

	questInfoToolResponse.name = name
	questInfoToolResponse.questNumber = parseInt(number)
	questInfoToolResponse.featuredImageName = image

	if (release) {
		const releaseParts = getReleaseParts(release)
		questInfoToolResponse.releaseDay = parseInt(releaseParts[1])
		questInfoToolResponse.releaseMonth = releaseParts[2]
		questInfoToolResponse.releaseYear = releaseParts[3]
	}

	questInfoToolResponse.update = update
	questInfoToolResponse.aka = aka

	if (members.toLowerCase() === 'yes') {
		questInfoToolResponse.membersOnly = true
	}

	if (members.toLowerCase() === 'no') {
		questInfoToolResponse.membersOnly = false
	}

	questInfoToolResponse.series = series
	questInfoToolResponse.developer = developer

	// TODO: Get batched item list info: https://oldschool.runescape.wiki/api.php?action=query&titles=[ITEM_LIST]&prop=revisions&rvprop=content&format=json
	// - ITEM_LIST is a URL-encoded list of strings; one string per item, separated by the '|' character (e.g., Bucket|Egg|Feather for a list containing the items Bucket, Egg and Feather)

	// TODO: Get location map data: https://oldschool.runescape.wiki/api.php?action=query&titles=[LOCATION]&prop=revisions&rvprop=content&format=json
	// - LOCATION is a URL-encoded string name of the location to get the info for
	// - Need to make sure this targets the given Quest's Quest giver.

	// TODO: Get batched enemy data: https://oldschool.runescape.wiki/api.php?action=query&titles=Enemy1|Enemy2&prop=revisions&rvprop=content&format=json

	{return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(questInfoToolResponse, null),
			},
		],
	};}
}

server.registerTool(
	'get_osrs_quest_info',
	{
		description: loadPrompt('wiki', 'getQuestInfo.txt'),
		inputSchema: {
			questName: z.string().describe('The name of the Quest to get the info for.'),
		},
		outputSchema: QuestInfoToolResponse,
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ questName }) => getQuestInfo(questName),
)
