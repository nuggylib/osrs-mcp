import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SetLevelRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { loadPrompt } from './promptLoader';

// Log level hierarchy (higher index = more severe)
const LOG_LEVELS = ['debug', 'info', 'notice', 'warning', 'error', 'critical', 'alert', 'emergency'] as const;
type LogLevel = typeof LOG_LEVELS[number];

// Global log level state - per MCP spec, servers should not emit logs until setLevel is received
let currentLogLevel: LogLevel | null = null;

export function getCurrentLogLevel(): LogLevel | null {
	return currentLogLevel;
}

export function shouldLog(messageLevel: LogLevel): boolean {
	// Per MCP spec: "A server implemented to spec will not emit logs until a setLevel message is received"
	if (currentLogLevel === null) {
		return false;
	}

	const currentLevelIndex = LOG_LEVELS.indexOf(currentLogLevel);
	const messageLevelIndex = LOG_LEVELS.indexOf(messageLevel);

	// Only log if message level is at or above current level
	return messageLevelIndex >= currentLevelIndex;
}

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
	const { level } = request.params;

	// Set the logging level as per MCP specification
	currentLogLevel = level as LogLevel;

	return {};
})

