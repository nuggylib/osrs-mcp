import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../server.js';
import { z } from 'zod'

export async function getBacklinksForPage(
	/**
	 * The page to fetch the backlinks for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const backlinks = await response.backlinks()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(backlinks, null, 2),
			},
		],
	};
}

server.tool(
	'get_osrs_wiki_page_backlinks',
	'Use this to get the backlinks for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the backlinks for.'),
	},
	async ({ pageName }) => getBacklinksForPage(pageName),
)
