import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';
import { loadPrompt } from '../../utils/promptLoader.js';
import { createOSRSWikiAPIAction } from '../../utils/osrsWikiAPIActionFactory.js';
import { SUPPORTED_API_ACTIONS, SUPPORTED_PARSETREE_TEMPLATE_TITLE, QuestDetailsTemplate, InfoboxQuestTemplate } from '../../types/osrsWiki.js';
import { extractTemplatesFromParseTreeXML } from '../../utils/wikimedia/extractTemplatesFromParseTreeXML.js';
import { findTemplates } from '../../utils/templateHelpers.js';
import { QuestInfoToolResponse } from '../../types/osrsMcp.js';

export async function getQuestInfo(
	questName: string,
): Promise<CallToolResult> {
	const response: Partial<QuestInfoToolResponse> = {}
	const parseActionParseTree = createOSRSWikiAPIAction<XMLDocument>(SUPPORTED_API_ACTIONS.EXPANDTEMPLATES, {
		page: questName,
		prop: 'parsetree',
	}, 'xml')

	const parseTreeResponse = await parseActionParseTree({})
	const parseTreeXmlDocument = parseTreeResponse.data
	const parsedTemplates = extractTemplatesFromParseTreeXML(parseTreeXmlDocument)

	const questDetailsTemplate = findTemplates<QuestDetailsTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.QUEST_DETAILS)[0]
	const infoboxQuestTemplate = findTemplates<InfoboxQuestTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.INFOBOX_QUEST)[0]

	const { start, startmap, difficulty, length, requirements, recommended, kills } = questDetailsTemplate.parameters

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


	// TODO: parse `requirements` for itemReqs (see documentation for requirements on how this string is structured)
	// TODO: parse `requirements` for questReqs
	// TODO: parse `requirements` for skillReqs
	// TODO: parse `recommended` for recommendedItems
	// TODO: parse `recommended` for recommendedSkills
	// TODO: pase `kills` for enemiesToDefeat

	const { name, number, image, release, update, aka, members, series, developer } = infoboxQuestTemplate.parameters

	// TODO: Get batched item list info: https://oldschool.runescape.wiki/api.php?action=query&titles=[ITEM_LIST]&prop=revisions&rvprop=content&format=json
	// - ITEM_LIST is a URL-encoded list of strings; one string per item, separated by the '|' character (e.g., Bucket|Egg|Feather for a list containing the items Bucket, Egg and Feather)

	// TODO: Get location map data: https://oldschool.runescape.wiki/api.php?action=query&titles=[LOCATION]&prop=revisions&rvprop=content&format=json
	// - LOCATION is a URL-encoded string name of the location to get the info for
	// - Need to make sure this targets the given Quest's Quest giver.

	// TODO: Get batched enemy data: https://oldschool.runescape.wiki/api.php?action=query&titles=Enemy1|Enemy2&prop=revisions&rvprop=content&format=json

	// TODO: Create an output object unifying the data in a way that matches the outputSchema in the tool definition.

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
		outputSchema: {
			questGiver: z.string().describe('The name of the Quest giver.'),
			startingPoint: z.string().describe('The map coordinates of the Quest giver\'s location.'),
			difficulty: z.string().describe('The official difficulty of this Quest as-set by Jagex.'),
			length: z.string().describe('The official length of this Quest as-set by Jagex.'),
			itemReqs: z.set(
				z.string().describe('The Item name'),
			).describe('The Items required to complete this Quest.'),
			questReqs: z.set(
				z.string().describe('The pre-requisite Quest name'),
			).describe('The Quests that need to be completed before this Quest can be completed.'),
			skillReqs: z.record(
				z.string().describe('The Skill name'),
			).describe('The Skill levels required for to complete this Quest.'),
			recommendedItems: z.set(
				z.string().describe('The Item name'),
			).describe('The recommended Items for this Quest that will make completing it easier.'),
			recommendedSkills: z.record(
				z.string().describe('The Skill name'),
			).describe('The Skill levels recommended for this Quest that will make completing it easier.'),
			enemiesToDefeat: z.set(
				z.string().describe('The name of an enemy Monster'),
			).describe('The list of enemies that need to be defeated to complete this Quest.'),
			questPoints: z.number().describe('The number of Quest Points this Quest awards on completion.'),
			itemRewards: z.record(
				z.string().describe('The name of the Item reward.'),
			).describe('The Items awarded to the player upon completion of this Quest with the number of how many of each are awarded.'),
			xpRewards: z.record(
				z.string().describe('The name of the Skill granted XP.'),
			).describe('The Skills which are granted reward XP upon completion of this Quest, as well as how much XP is granted for each.'),
			uniqueRewards: z.set(
				z.string().describe('A description of the unique reward.'),
			).describe('The list of unique rewards granted upon completion of this Quest.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ questName }) => getQuestInfo(questName),
)
