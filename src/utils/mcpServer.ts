import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SetLevelRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadPrompt } from './promptLoader';

export const server = new McpServer({
	name: 'osrs-mcp',
	version: '0.0.1',
}, {
	instructions: loadPrompt('', 'server.txt'),
	capabilities: {
		resources: {},
		tools: {},
		logging: {},
	},
})

server.server.setRequestHandler(SetLevelRequestSchema, async (request) => {
	const { level } = request.params
	return {}
})

