import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../server.js';
import { z } from 'zod'

export async function getCategoriesForPage(
	/**
	 * The page to fetch the categories for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const categories = await response.categories()


	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(categories, null, 2),
			},
		],
	};
}

server.tool(
	'get_osrs_wiki_page_categories',
	'Use this to get the categories for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the categories for.'),
	},
	async ({ pageName }) => getCategoriesForPage(pageName),
)
