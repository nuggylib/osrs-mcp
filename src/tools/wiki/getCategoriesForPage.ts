import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';

export async function getCategoriesForContent(
	/**
	 * The page to fetch the categories for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const categories = await response.categories()


	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(categories, null, 2),
			},
		],
	};
}
