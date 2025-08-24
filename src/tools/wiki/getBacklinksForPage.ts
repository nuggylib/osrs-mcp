import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';

export async function getBacklinksForPage(
	/**
	 * The page to fetch the backlinks for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const backlinks = await response.backlinks()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(backlinks, null, 2),
			},
		],
	};
}
