import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { z } from 'zod';
import { server } from '../../utils/mcpServer.js';

export async function getFullInfoKeysForPage(
	/**
	 * The page to fetch the links for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const links = await response.fullInfo()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(links.general, null, 2),
			},
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_info',
	{
		description: 'Every Page in the OSRS Wiki has info keys that represent crucial data points for the given Page. Each Page type (Monster, Skill, Item, etc.) share common keys. ALWAYS Use this to get the list of info keys for a given page.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the info for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ pageName }) => getFullInfoKeysForPage(pageName),
)
