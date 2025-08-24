import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { searchWikiForTopicMatches } from '../../utils/osrsWiki';

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