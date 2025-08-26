import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';

export async function getReferencesForPage(
	/**
	 * The page to fetch the references for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const references = await response.references()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(references, null, 2),
			},
		],
	};
}

server.tool(
	'get_osrs_wiki_page_references',
	'Use this to get the references for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the references for.'),
	},
	async ({ pageName }) => getReferencesForPage(pageName),
)
