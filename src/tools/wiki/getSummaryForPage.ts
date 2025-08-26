import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../utils/mcpServer.js';
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
		description: 'Use this to get the summary for the page name in the OSRS Wiki. This is intended to be used after getting a page title from the ask_wiki_about_topic tool, which ensures this tool is only used for pages that are known to exist.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the summary for.'),
		},
	},
	async ({ pageName }) => getSummaryForPage(pageName),
)
