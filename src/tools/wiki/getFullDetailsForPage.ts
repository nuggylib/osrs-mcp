import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { OSRSWikiAPIQueryActionResult } from '../../types/osrsWiki.js';
import { createQueryAction, SUPPORTED_VALUES_PROP_PARAM } from '../../utils/osrsWikiAPIActionFactory.js';

export async function getFullDetailsForPage(
	/**
     * The page to fetch the details for
     */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const queryAction = createQueryAction()
	const response = await queryAction({
		params: {
			titles: pageName.trim(),
			prop: SUPPORTED_VALUES_PROP_PARAM.REVISIONS,
		},
	})

	const pageResult: OSRSWikiAPIQueryActionResult = response.data;
	const pageIdx = Object.keys(pageResult.query.pages).at(0) || ''

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(pageResult.query.pages[pageIdx].revisions, null, 2),
			},
		],
	};
}
