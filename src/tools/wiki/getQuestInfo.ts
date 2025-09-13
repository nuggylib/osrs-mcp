import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';
import { loadPrompt } from '../../utils/promptLoader.js';
import { createOSRSWikiAPIAction } from '../../utils/osrsWikiAPIActionFactory.js';
import { SUPPORTED_API_ACTIONS, SUPPORTED_PARSETREE_TEMPLATE_TITLE, QuestDetailsTemplate, InfoboxQuestTemplate } from '../../types/osrsWiki.js';
import { extractTemplatesFromXML as extractTemplatesFromXML } from '../../utils/wikimedia/extractTemplatesFromXML.js';
import { findTemplates } from '../../utils/templateHelpers.js';
import { QuestInfoToolResponse } from '../../zod';
import { QuestInfoToolResponseType } from '../../types/osrsMcp.js';
import { getRequiredItems, getRequiredQuests, getRequiredSkills, getRecommendedItems, getRecommendedSkills, getEnemiesToKill } from '../../core/quest';

export async function getQuestInfo(
	questName: string,
): Promise<CallToolResult> {
	const response: Partial<QuestInfoToolResponseType> = {}
	const parseActionParseTree = createOSRSWikiAPIAction<XMLDocument>(SUPPORTED_API_ACTIONS.EXPANDTEMPLATES, {
		page: questName,
		prop: 'parsetree',
	}, 'xml')

	const parseTreeResponse = await parseActionParseTree({})
	const parseTreeXmlDocument = parseTreeResponse.data
	const parsedTemplates = extractTemplatesFromXML(parseTreeXmlDocument)

	const questDetailsTemplate = findTemplates<QuestDetailsTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.QUEST_DETAILS)[0]
	const infoboxQuestTemplate = findTemplates<InfoboxQuestTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.INFOBOX_QUEST)[0]

	const { start, startmap, difficulty, length, requirements, recommended, kills } = questDetailsTemplate.parameters

	// TODO: Parse this differently to store the X and Y individually for easier use.
	response.startingPoint = startmap
	response.difficulty = difficulty
	response.length = length

	// Parse `start` for the questGiver (pattern is generally "Speak/Talk to [[NPC_NAME]] at/in..." followed by location)
	const questGiverMatch = start.match(/(?:Speak|Talk)\s+(?:to|with)\s+\[\[([^\]]+)\]\]/i)
	if (questGiverMatch) {
		// Extract the NPC name, handling cases where it might have a pipe for display text
		const npcNameRaw = questGiverMatch[1]
		// If there's a pipe, the actual NPC name is before it
		response.questGiver = npcNameRaw.split('|')[0].trim()
	}

	if (requirements) {
		response.itemReqs = getRequiredItems(requirements)
		response.questReqs = getRequiredQuests(requirements)
		response.skillReqs = getRequiredSkills(requirements)
	}

	if (recommended) {
		response.recommendedItems = getRecommendedItems(recommended)
		response.recommendedSkills = getRecommendedSkills(recommended)
		// TODO: Travel recommendations (e.g., fairy rings, glider paths, gnome tree usage, etc.)
	}

	if (kills) {
		response.enemiesToDefeat = getEnemiesToKill(kills)
	}

	const { name, number, image, release, update, aka, members, series, developer } = infoboxQuestTemplate.parameters

	// TODO: Get batched item list info: https://oldschool.runescape.wiki/api.php?action=query&titles=[ITEM_LIST]&prop=revisions&rvprop=content&format=json
	// - ITEM_LIST is a URL-encoded list of strings; one string per item, separated by the '|' character (e.g., Bucket|Egg|Feather for a list containing the items Bucket, Egg and Feather)

	// TODO: Get location map data: https://oldschool.runescape.wiki/api.php?action=query&titles=[LOCATION]&prop=revisions&rvprop=content&format=json
	// - LOCATION is a URL-encoded string name of the location to get the info for
	// - Need to make sure this targets the given Quest's Quest giver.

	// TODO: Get batched enemy data: https://oldschool.runescape.wiki/api.php?action=query&titles=Enemy1|Enemy2&prop=revisions&rvprop=content&format=json

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(response, null),
			},
		],
	};
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
