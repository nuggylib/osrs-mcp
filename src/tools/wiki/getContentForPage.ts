import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';

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
	// TODO: Rip out all of the wikijs code; it conceals a lot of data we need (this value confirms it - there isn't much here but blocks of strings)
	const pageContent = await response.content()

	return {
		content: [
			{
				type: 'text',
				text: pageContent,
			},
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_full_content',
	{
		description: 'Use this to get the full Wiki Text for the page name in the OSRS Wiki. Use this when the get_osrs_wiki_page_summary tool does not provide a detailed enough explanation of the given page name.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the full content for.'),
		},
		annotations: {
			openWorldHint: true,
		},
	},
	async ({ pageName }) => getRawContentForPage(pageName),
)
