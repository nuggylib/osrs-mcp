import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadPrompt } from './promptLoader';

export const server = new McpServer({
	name: 'osrs-mcp',
	version: '0.0.1',
	capabilities: {
		resources: {},
		tools: {},
	},
}, {
	instructions: loadPrompt('', 'server.txt'),
})
