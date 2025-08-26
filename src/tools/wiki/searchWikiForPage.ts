import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { searchWikiForTopicMatches } from '../../utils/osrsWiki';
import { server } from '../../utils/mcpServer.js';
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

server.tool(
	'search_osrs_wiki_for_topic',
	'Use whenever the user asks about an Old School RuneScape topic, or if the agent needs to gain further context on a topic to improve a response. Always defer to using the information from the wiki instead of potentially-outdated training data.',
	{
		topic: z.string().describe('The specific Old School RuneScape topic to search the Wiki for.'),
	},
	async ({ topic }) => searchWikiForPage(topic),
);
