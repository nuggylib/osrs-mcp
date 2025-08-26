import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { z } from 'zod';
import { server } from '../../utils/mcpServer.js';

export async function getLinksForPage(
	/**
	 * The page to fetch the links for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const links = await response.links()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(links, null, 2),
			},
		],
	};
}

server.tool(
	'get_osrs_wiki_page_links',
	'Use this to get the links for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the links for.'),
	},
	async ({ pageName }) => getLinksForPage(pageName),
)
