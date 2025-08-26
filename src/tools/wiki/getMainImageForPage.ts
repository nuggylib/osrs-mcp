import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import axios from 'axios';
import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';

export async function getMainImageForPage(
	/**
	 * The page to fetch the tables for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const mainImageUrl = await response.mainImage()
	const mainImageResponse = await axios.get(mainImageUrl, { responseType: 'arraybuffer' });

	return {
		content: [
			{
				type: 'image',
				data: Buffer.from(mainImageResponse.data).toString('base64'),
				mimeType: 'image/png',
			},
		],
	};
}

server.tool(
	'get_osrs_wiki_page_main_image',
	'Use this to get the main image for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the main image for.'),
	},
	async ({ pageName }) => getMainImageForPage(pageName),
)
