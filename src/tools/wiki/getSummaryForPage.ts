import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getSummaryForTopic } from '../../utils/osrsWiki.js';

export async function getSummaryForPage(
	/**
     * The page to fetch a summary for
     */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getSummaryForTopic(pageName)

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(response, null, 2),
			},
		],
	};
}
