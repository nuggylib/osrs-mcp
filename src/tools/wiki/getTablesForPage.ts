import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';

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
	console.error('TABLES: ', tables)

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(tables, null, 2),
			},
		],
	};
}
