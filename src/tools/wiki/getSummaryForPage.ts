import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { OSRSWikiAPIResult } from '../../types/osrsWiki.js';
import { makeOsrsWikiAPIQuery } from '../../utils/osrsWikiApiRequest.js';

export async function getSummaryForPage(
	/**
     * The page to fetch a summary for
     */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await makeOsrsWikiAPIQuery({
		params: {
			titles: pageName.trim(),
			prop: 'extracts',
		},
	})

	const pageResult: OSRSWikiAPIResult = response.data;
	const pageIdx = Object.keys(pageResult.query.pages).at(0) || ''

	return {
		content: [
			{
				type: 'text',
				text: JSON.stringify(pageResult.query.pages[pageIdx].extract, null, 2),
			},
		],
	};
}
