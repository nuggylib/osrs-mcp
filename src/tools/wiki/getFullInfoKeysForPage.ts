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

// TODO: Improve this description to match what it ACTUALLY is (extremely important data points from the side table)
server.registerTool(
	'get_osrs_wiki_page_info',
	{
		description: 'Info keys ALWAYS Use this to get the list of info keys for a given page.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the info for.'),
		},
	},
	async ({ pageName }) => getFullInfoKeysForPage(pageName),
)
