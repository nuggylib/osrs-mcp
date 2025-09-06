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

// TODO: Determine if we should just remove this tool altogether, or if there is a way to
server.registerTool(
	'get_osrs_wiki_page_tables',
	{
		description: 'DO NOT USE. The OSRS Wiki does not appear to return table data for any topic.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the tables for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ pageName }) => getTablesForPage(pageName),
)
