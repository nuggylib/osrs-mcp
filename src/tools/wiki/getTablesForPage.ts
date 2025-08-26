import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';

export async function getTablesForPage(
	/**
	 * The page to fetch the tables for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const tables = await response.tables()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(tables, null, 2),
			},
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_tables',
	{
		description: 'Use this to get the tables for the given page name in the OSRS Wiki.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the tables for.'),
		},
	},
	async ({ pageName }) => getTablesForPage(pageName),
)
