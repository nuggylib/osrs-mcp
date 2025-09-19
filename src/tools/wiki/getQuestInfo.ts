import { CallToolResult, ServerNotification, ServerRequest } from '@modelcontextprotocol/sdk/types.js';
import { JSDOM } from 'jsdom'

import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';
import { loadPrompt } from '../../utils/promptLoader.js';
import { createOSRSWikiAPIAction } from '../../utils/osrsWikiAPIActionFactory.js';
import { SUPPORTED_API_ACTIONS, SUPPORTED_PARSETREE_TEMPLATE_TITLE, QuestDetailsTemplate, InfoboxQuestTemplate, QuestRewardsTemplate } from '../../types/osrsWiki.js';
import { extractTemplatesFromXML as extractTemplatesFromXML } from '../../utils/wikimedia/extractTemplatesFromXML.js';
import { extractTemplatesFromParameter } from '../../utils/wikimedia/extractTemplatesFromParameter.js';
import { findTemplates } from '../../utils/templateHelpers.js';
import { QuestInfoToolResponse } from '../../zod';
import { QuestInfoToolResponseType } from '../../types/osrsMcp.js';
import { getRequiredItems, getRequiredQuests, getRequiredSkills, getRecommendedItems, getRecommendedSkills, getEnemiesToKill } from '../../workflows/quest/index.js';
import { getReleaseParts } from '../../workflows/quest/getReleaseParts.js';
import { sendLog } from '../../utils/sendLog.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';

export async function getQuestInfo(
	questName: string,
	serverContext?: RequestHandlerExtra<ServerRequest, ServerNotification>,
): Promise<CallToolResult> {
	const questInfoToolResponse: Partial<QuestInfoToolResponseType> = {}
	try {
		const parseActionParseTree = createOSRSWikiAPIAction<string>(SUPPORTED_API_ACTIONS.PARSE, {
			page: questName,
			prop: 'parsetree',
		}, 'xml')

		const parseTreeResponse = await parseActionParseTree({})
		// First parse the outer XML response to get the parsetree content
		const outerJsDOM = new JSDOM(parseTreeResponse.data, {
			contentType: 'text/xml',
		})

		// Extract the parsetree content (which is HTML-encoded XML)
		const parsetreeElement = outerJsDOM.window.document.querySelector('parsetree')
		if (!parsetreeElement) {
			throw new Error('No parsetree element found in API response')
		}

		// Get the decoded XML content from the parsetree element
		const decodedParsetreeXML = parsetreeElement.textContent
		if (!decodedParsetreeXML) {
			throw new Error('Parsetree element is empty')
		}

		// Now parse the actual template XML
		const parseTreeJsDOM = new JSDOM(decodedParsetreeXML, {
			contentType: 'text/xml',
		})

		const parsedTemplates = extractTemplatesFromXML(parseTreeJsDOM)
		const questDetailsTemplate = findTemplates<QuestDetailsTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.QUEST_DETAILS)[0]
		const infoboxQuestTemplate = findTemplates<InfoboxQuestTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.INFOBOX_QUEST)[0]
		const questRewardsTemplate = findTemplates<QuestRewardsTemplate>(parsedTemplates, SUPPORTED_PARSETREE_TEMPLATE_TITLE.QUEST_REWARDS)[0]

		await sendLog(serverContext, 'debug', 'getQuestInfo', {
			message: 'Quest templates extracted from wiki',
			questName,
			foundQuestDetails: !!questDetailsTemplate,
			foundInfoboxQuest: !!infoboxQuestTemplate,
			xmlDocTemplates: parsedTemplates,
			questDetailsParams: questDetailsTemplate?.parameters ? Object.keys(questDetailsTemplate.parameters) : [],
			infoboxParams: infoboxQuestTemplate?.parameters ? Object.keys(infoboxQuestTemplate.parameters) : [],
		})

		const { start, startmap, difficulty, length, requirements, items, recommended, kills } = questDetailsTemplate.parameters

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
			// Extract templates specifically from the requirements parameter
			const requirementsTemplates = extractTemplatesFromParameter(questDetailsTemplate, 'requirements')

			questInfoToolResponse.requiredItems = getRequiredItems(items)
			questInfoToolResponse.requiredQuests = getRequiredQuests(requirements)
			questInfoToolResponse.requiredSkills = getRequiredSkills(requirementsTemplates)
		}

		if (recommended) {
			// Extract templates specifically from the recommended parameter
			const recommendedTemplates = extractTemplatesFromParameter(questDetailsTemplate, 'recommended')

			questInfoToolResponse.recommendedItems = getRecommendedItems(recommended)
			questInfoToolResponse.recommendedSkills = getRecommendedSkills(recommendedTemplates)
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
			questInfoToolResponse.releaseDay = parseInt(releaseParts[0])
			questInfoToolResponse.releaseMonth = releaseParts[1]
			questInfoToolResponse.releaseYear = releaseParts[2]
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

		const { qp } = questRewardsTemplate.parameters

		questInfoToolResponse.questPoints = parseInt(qp)

		// TODO: Get batched item list info: https://oldschool.runescape.wiki/api.php?action=query&titles=[ITEM_LIST]&prop=revisions&rvprop=content&format=json
		// - ITEM_LIST is a URL-encoded list of strings; one string per item, separated by the '|' character (e.g., Bucket|Egg|Feather for a list containing the items Bucket, Egg and Feather)

		// TODO: Get location map data: https://oldschool.runescape.wiki/api.php?action=query&titles=[LOCATION]&prop=revisions&rvprop=content&format=json
		// - LOCATION is a URL-encoded string name of the location to get the info for
		// - Need to make sure this targets the given Quest's Quest giver.

		// TODO: Get batched enemy data: https://oldschool.runescape.wiki/api.php?action=query&titles=Enemy1|Enemy2&prop=revisions&rvprop=content&format=json

		await sendLog(serverContext, 'debug', 'getQuestInfo', {
			message: 'Quest info extraction completed',
			questName,
			data: questInfoToolResponse,
		})
		// Always return a compatible result, even if there was a failure. Logging should inform of the issue.
		return {
			content: [
				{
					type: 'text',
					text: '',
				},
			],
			structuredContent: questInfoToolResponse,
		}
	} catch (error) {
		await sendLog(serverContext, 'error', 'getQuestInfo', {
			message: 'Error during quest info extraction',
			questName,
			error: error instanceof Error ? error.message : String(error),
		})
		throw error
	}
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
	async ({ questName }, extra) => getQuestInfo(questName, extra),
)
