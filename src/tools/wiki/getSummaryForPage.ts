import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../utils/mcpServer.js';
import { loadPrompt } from '../../utils/promptLoader.js';
import { z } from 'zod';

export async function getSummaryForPage(
	/**
     * The page to fetch a summary for
     */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const page = await getPageForTopic(pageName)
	const summary = await page.summary()

	return {
		content: [
			{
				type: 'text',
				text: summary,
			},
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_summary',
	{
		description: loadPrompt('summary.txt', __dirname),
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the summary for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ pageName }) => getSummaryForPage(pageName),
)
