import { readFile } from 'fs/promises';
import { join } from 'path';
import { server } from '../../utils/mcpServer';

server.registerResource(
	'osrs_wiki_possible_monster_page_info_keys',
	'file:///fixtures/monsterInfoKeys.json',
	{
		name: 'OSRS Wiki Monster Page Info Keys',
		description: 'List of possible info keys available on OSRS Wiki Monster pages (e.g., Green dragon). Use this to understand what each info key represents for Monster pages in the OSRS Wiki. Every key can have a number appended to the end, if there are multiple versions of the Monster (like when there are different leveled versions of the Monster). If there are multiple versions of a Monster, but an info key DOESN\'T have a number appended, then it applies to all versions for that Monster.',
	},
	async () => {
		const filePath = join(process.cwd(), 'fixtures', 'monsterInfoKeys.json');
		const fileContents = await readFile(filePath, 'utf-8');

		return {
			contents: [
				{
					uri: 'file:///fixtures/monsterInfoKeys.json',
					text: fileContents,
					mimeType: 'application/json',
				},
			],
		}
	},
)
