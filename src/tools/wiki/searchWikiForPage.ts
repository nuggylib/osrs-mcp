import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { searchWikiForTopicMatches } from '../../utils/osrsWiki';
import { server } from '../../utils/mcpServer.js';
import { loadPrompt } from '../../utils/promptLoader.js';
import { z } from 'zod';

/**
 * Finds the top `limit` number of pages that match (or partially-match) the given
 * `searchTerm`. Defaults to 10 results.
 */
export async function searchWikiForPage(
	searchTerm: string,
	limit: number = 10,
): Promise<CallToolResult> {

	if (!searchTerm || searchTerm.trim() === '') {
		throw new Error('Search term cannot be empty');
	}

	const response = await searchWikiForTopicMatches(searchTerm, limit)

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(response.results, null, 2),
			},
		],
	}
}

server.registerTool(
	'search_osrs_wiki_for_topic',
	{
		description: loadPrompt('search.txt', __dirname),
		inputSchema: {
			topic: z.string().describe('The specific Old School RuneScape topic to search the Wiki for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ topic }) => searchWikiForPage(topic),
);
