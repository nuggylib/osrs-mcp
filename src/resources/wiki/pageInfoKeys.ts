import { server } from '../../utils/mcpServer';

server.registerResource(
	'osrs_wiki_possible_monster_page_info_keys',
	'file://./fixtures/infoKeys.json',
	{
		name: 'OSRS Wiki Monster Page Info Keys',
		description: 'List of possible info keys available on OSRS Wiki monster pages (e.g., Green dragon).',
	},
	async () => {

		return {
			// TODO: Find a way to explain that each key can potentially have a number appended at the end, if there are multiple tabs for the monster's details page
			contents: [
				{
					uri: 'file://./fixtures/infoKeys.json',
					text: 'Available page info keys for OSRS Wiki pages',
				},
			],
		}
	},
)
