import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

// Import all tools to trigger their registration
import './tools/index.js';
import { server } from './utils/mcpServer.js';

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error('OSRS MCP Server Running')
}

main().catch((error) => {
	console.error('Fatal error:', error);
	process.exit(1);
});
