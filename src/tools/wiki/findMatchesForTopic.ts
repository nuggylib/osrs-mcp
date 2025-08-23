import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';

// TODO: Determine if there is an API-based way to perform this search logic.
/**
 * Finds the top `limit` number of pages that match (or partially-match) the given
 * `searchTerm`. Defaults to 10 results.
 *
 * This handler uses a different endpoint than the other OSRS tools because it DOES NOT
 * use the Wiki API. Instead, it's using their site search API directly.
 */
export async function findMatchesForTopic(
	searchTerm: string,
	limit: number = 10,
): Promise<CallToolResult> {

	if (!searchTerm || searchTerm.trim() === '') {
		throw new Error('Search term cannot be empty');
	}

	try {
		// This does not use the API endpoint; it's the search API that their site uses to find relevant results
		const response = await axios.get<any>(
			'https://oldschool.runescape.wiki/rest.php/v1/search/title',
			{
				params: {
					q: searchTerm.trim(),
					limit: limit,
				},
				headers: {
					'User-Agent': 'osrs-mcp/1.0.0',
				},
			},
		);

		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(response.data, null, 2),
				},
			],
		}
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('API Error Details:', {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				url: error.config?.url,
				params: error.config?.params,
			});
			throw new Error(`Failed to search Wiki: ${error.response?.status} ${error.response?.statusText} - ${error.message}`);
		}
		throw error;
	}
}