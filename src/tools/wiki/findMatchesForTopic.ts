import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { createOSRSWikiAPIAction, SUPPORTED_API_ACTIONS } from '../../utils/osrsWikiAPIActionFactory';
import { OSRSWikiAPIOpenSearchActionResult } from '../../types/osrsWiki';

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

	const openSearchAction = createOSRSWikiAPIAction<OSRSWikiAPIOpenSearchActionResult>(SUPPORTED_API_ACTIONS.OPENSEARCH)
	const response = await openSearchAction({
		params: {
			q: searchTerm.trim(),
			limit: limit,
		},
	})

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(response.data[1], null, 2),
			},
		],
	}
}