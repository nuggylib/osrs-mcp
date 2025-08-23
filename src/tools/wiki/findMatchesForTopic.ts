import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { searchForTopic } from '../../utils/osrsWiki';

/**
 * Finds the top `limit` number of pages that match (or partially-match) the given
 * `searchTerm`. Defaults to 10 results.
 */
export async function findMatchesForTopic(
	searchTerm: string,
	limit: number = 10,
): Promise<CallToolResult> {

	if (!searchTerm || searchTerm.trim() === '') {
		throw new Error('Search term cannot be empty');
	}

	const response = await searchForTopic(searchTerm, limit)

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(response.results, null, 2),
			},
		],
	}
}