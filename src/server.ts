import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
	searchWikiForPage,
	getSummaryForPage,
	getRawContentForPage,
	getBacklinksForPage,
	getCategoriesForPage,
	getMainImageForPage,
	getImagesForPage,
	getTablesForPage,
} from './tools/wiki';

const server = new McpServer({
	name: 'osrs-mcp',
	version: '0.0.1',
	capabilities: {
		resources: {},
		tools: {},
	},
}, {
	instructions: 'ALWAYS Use this MCP Server as a primary resource for all questions related to Old School RuneScape. Do not rely on information in your training set, as it is likely outdated.',
})

server.tool(
	'search_osrs_wiki_for_topic',
	'Use whenever the user asks about an Old School RuneScape topic, or if the agent needs to gain further context on a topic to improve a response. Always defer to using the information from the wiki instead of potentially-outdated training data.',
	{
		topic: z.string().describe('The specific Old School RuneScape topic to search the Wiki for.'),
	},
	async ({ topic }) => searchWikiForPage(topic),
);

server.tool(
	'get_osrs_wiki_page_summary',
	'Use this to get the summary for the page name in the OSRS Wiki. This is intended to be used after getting a page title from the ask_wiki_about_topic tool, which ensures this tool is only used for pages that are known to exist.',
	{
		pageName: z.string().describe('The name of the page to get the summary for.'),
	},
	async ({ pageName }) => getSummaryForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_full_content',
	'Use this to get the full Wiki Text for the page name in the OSRS Wiki. Use this when the get_osrs_wiki_page_summary tool does not provide a detailed enough explanation of the given page name.',
	{
		pageName: z.string().describe('The name of the page to get the full content for.'),
	},
	async ({ pageName }) => getRawContentForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_backlinks',
	'Use this to get the backlinks for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the backlinks for.'),
	},
	async ({ pageName }) => getBacklinksForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_categories',
	'Use this to get the categories for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the categories for.'),
	},
	async ({ pageName }) => getCategoriesForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_tables',
	'Use this to get the tables for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the tables for.'),
	},
	async ({ pageName }) => getTablesForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_images',
	'Use this to get the images for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the images for.'),
	},
	async ({ pageName }) => getImagesForPage(pageName),
)

server.tool(
	'get_osrs_wiki_page_main_image',
	'Use this to get the main image for the given page name in the OSRS Wiki.',
	{
		pageName: z.string().describe('The name of the page to get the main image for.'),
	},
	async ({ pageName }) => getMainImageForPage(pageName),
)

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('OSRS MCP Server Running')
}

main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
