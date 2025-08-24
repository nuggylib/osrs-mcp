import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';

export async function getRawContentForPage(
	/**
     * The page to fetch the details for
     */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const pageContent = await response.rawContent()

	return {
		content: [
			{
				type: 'text',
				text: pageContent,
			},
		],
	};
}
