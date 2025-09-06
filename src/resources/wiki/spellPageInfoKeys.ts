import { readFile } from 'fs/promises';
import { join } from 'path';
import { server } from '../../utils/mcpServer';

const resourceName = 'osrs_wiki_possible_spell_page_info_keys'
const fireUri = 'file://./fixtures/spellPageInfoKeys.json'

server.registerResource(
	resourceName,
	fireUri,
	{
		name: resourceName,
		title: 'OSRS Wiki Spell Page Info Keys',
		description: 'List of possible info keys available on OSRS Wiki Spell pages.' +
			' Use this to understand what each info key represents for Spell pages in the' +
			' OSRS Wiki.',
	},
	async () => {
		const filePath = join(process.cwd(), 'fixtures', 'spellPageInfoKeys.json');
		const fileContents = await readFile(filePath, 'utf-8');

		return {
			contents: [
				{
					uri: fireUri,
					text: fileContents,
					mimeType: 'application/json',
				},
			],
		}
	},
)
