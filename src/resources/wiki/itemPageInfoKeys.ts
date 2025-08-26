import { readFile } from 'fs/promises';
import { join } from 'path';
import { server } from '../../utils/mcpServer';

const resourceName = 'osrs_wiki_possible_item_page_info_keys'
const fileUri = 'file://./fixtures/itemPageInfoKeys.json'

server.registerResource(
	resourceName,
	fileUri,
	{
		name: resourceName,
		title: 'OSRS Wiki Item Page Info Keys',
		description: 'List of possible info keys available on OSRS Wiki Item pages (e.g., Dragon Scimitar). Use this to understand what each info key represents for Item pages in the OSRS Wiki. Every key can have a number appended to the end, if there are multiple versions of the Item (like items with cosmetic variants or upgraded versions). If there are multiple versions of an Item, but an info key DOESN\'T have a number appended, then it applies to all versions for that Item.',
	},
	async () => {
		const filePath = join(process.cwd(), 'fixtures', 'itemPageInfoKeys.json');
		const fileContents = await readFile(filePath, 'utf-8');

		return {
			contents: [
				{
					uri: fileUri,
					text: fileContents,
					mimeType: 'application/json',
				},
			],
		}
	},
)
