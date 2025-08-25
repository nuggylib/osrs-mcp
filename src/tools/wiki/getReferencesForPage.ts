import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';

export async function getReferencesForPage(
	/**
	 * The page to fetch the references for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const references = await response.references()

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(references, null, 2),
			},
		],
	};
}
