import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadPrompt } from './promptLoader';
import { LoggingLevelSchema } from '@modelcontextprotocol/sdk/types.js';

export const server = new McpServer({
	name: 'osrs-mcp',
	version: '0.0.1',
	capabilities: {
		resources: {},
		tools: {},
		logging: {
			level: LoggingLevelSchema.Enum.debug,
		},
	},
}, {
	instructions: loadPrompt('', 'server.txt'),
})
