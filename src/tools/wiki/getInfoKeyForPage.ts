import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { z } from 'zod';
import { server } from '../../utils/mcpServer.js';

export async function getInfoKeyValueForPage(
	/**
	 * The page to fetch the links for.
	 */
	pageName: string,
	/**
	 * The key to query within the page.
	 */
	key: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	if (!key || key.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	// Can be either a string, object or array
	const infoValue = await response.info(key)

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(infoValue, null, 2),
			},
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_info_by_key',
	{
		description: 'Keys represent crucial data points for a topic. Use this to get the value for a ' +
			'given info key on the given page name in the OSRS Wiki. Use the appropriate Info Keys resource ' +
			'JSON file to gain context on what a given key represents.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the links for.'),
			key: z.string().describe('The name of the key to get value for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ pageName, key }) => getInfoKeyValueForPage(pageName, key),
)
