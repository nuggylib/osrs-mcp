import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

import { getPageForTopic } from '../../utils/osrsWiki.js';
import axios from 'axios';

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
