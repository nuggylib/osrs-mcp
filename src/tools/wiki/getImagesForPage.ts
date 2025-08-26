import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import axios from 'axios';
import { server } from '../../utils/mcpServer.js';
import { z } from 'zod';

export async function getImagesForPage(
	/**
	 * The page to fetch the tables for
	 */
	pageName: string,
): Promise<CallToolResult> {
	if (!pageName || pageName.trim() === '') {
		throw new Error('pageName cannot be empty');
	}

	const response = await getPageForTopic(pageName)
	const imagesUrls = await response.images()

	const imagesArray = [] as {
		type: 'image',
		data: string,
		mimeType: 'image/png',
	}[]

	await Promise.all(
		imagesUrls.map(async (imageUrl) => {
			const mainImageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
			imagesArray.push({
				type: 'image',
				data: Buffer.from(mainImageResponse.data).toString('base64'),
				mimeType: 'image/png',
			})
		}),
	)

	return {
		content: [
			...imagesArray,
		],
	};
}

server.registerTool(
	'get_osrs_wiki_page_images',
	{
		description: 'Use this to get the images for the given page name in the OSRS Wiki.',
		inputSchema: {
			pageName: z.string().describe('The name of the page to get the images for.'),
		},
	},
	async ({ pageName }) => getImagesForPage(pageName),
)
