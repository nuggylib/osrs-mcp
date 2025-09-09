import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';
import { loadPrompt } from '../../utils/promptLoader.js';

export async function getQuestInfo(
	/**
	 * The page to fetch the tables for
	 */
	questName: string,
): Promise<CallToolResult> {
	if (!questName || questName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	// TODO: Get the base quest info (infobox, required items list, pre-requisites, enemy names): https://oldschool.runescape.wiki/api.php?action=query&titles=[QUEST_NAME]&prop=text|categories|links|templates|sections&rvprop=content&format=json

	// TODO: Get batched item list info: https://oldschool.runescape.wiki/api.php?action=query&titles=[ITEM_LIST]&prop=revisions&rvprop=content&format=json
	// - ITEM_LIST is a URL-encoded list of strings; one string per item, separated by the '|' character (e.g., Bucket|Egg|Feather for a list containing the items Bucket, Egg and Feather)

	// TODO: Get location map data: https://oldschool.runescape.wiki/api.php?action=query&titles=[LOCATION]&prop=revisions&rvprop=content&format=json
	// - LOCATION is a URL-encoded string name of the location to get the info for
	// - Need to make sure this targets the given quest's quest giver.

	// TODO: Get batched enemy data: https://oldschool.runescape.wiki/api.php?action=query&titles=Enemy1|Enemy2&prop=revisions&rvprop=content&format=json

	// TODO: Create an output object unifying the data in a way that matches the outputSchema in the tool definition.

	return {
		content: [
			{
				type: 'text',
				text: '',
			},
		],
	};
}

server.registerTool(
	'get_osrs_quest_info',
	{
		description: loadPrompt('wiki', 'getQuestInfo.txt'),
		inputSchema: {
			questName: z.string().describe('The name of the quest to get the info for.'),
		},
		outputSchema: {
			startingPoint: z.string().describe('The map coordinates of the quest giver\'s location.'),
			difficulty: z.string().describe('The official difficulty of this quest as-set by Jagex.'),
			length: z.string().describe('The official length of this quest as-set by Jagex.'),
			itemReqs: z.set(
				z.string().describe('The Item name'),
			).describe('The Items required to complete this quest.'),
			questReqs: z.set(
				z.string().describe('The pre-requisite Quest name'),
			).describe('The Quests that need to be completed before this Quest can be completed.'),
			skillReqs: z.record(
				z.string().describe('The Skill name'),
			).describe('The Skill levels required for to complete this quest.'),
			recommendedItems: z.set(
				z.string().describe('The Item name'),
			).describe('The recommended Items for this quest that will make completing it easier.'),
			recommendedSkills: z.record(
				z.string().describe('The Skill name'),
			).describe('The Skill levels recommended for this quest that will make completing it easier.'),
			enemiesToDefeat: z.set(
				z.string().describe('The name of an enemy Monster'),
			).describe('The list of enemies that need to be defeated to complete this Quest.'),
			questPoints: z.number().describe('The number of Quest Points this Quest awards on completion.'),
			itemRewards: z.record(
				z.string().describe('The name of the Item reward.'),
			).describe('The Items awarded to the player upon completion of this Quest with the number of how many of each are awarded.'),
			xpRewards: z.record(
				z.string().describe('The name of the Skill granted XP.'),
			).describe('The Skills which are granted reward XP upon completion of this quest, as well as how much XP is granted for each.'),
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
