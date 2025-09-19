import { shouldLog } from './mcpServer.js';

export interface LogData {
	message: string;
	[key: string]: any;
}

/**
 * Send logging message through the current request's transport
 * Per MCP spec: servers should filter logs based on the level set by logging/setLevel
 * @param serverContext - The context object from the tool callback's second parameter
 * @param level - Log level
 * @param logger - Logger name/category
 * @param data - Log data including message and any additional fields
 */
export async function sendLog(
	serverContext: any,
	level: 'debug' | 'info' | 'notice' | 'warning' | 'error' | 'critical' | 'alert' | 'emergency',
	logger: string,
	data: LogData,
): Promise<void> {
	// Check if this log level should be sent based on MCP spec requirements
	if (!shouldLog(level)) {
		return; // Don't send logs below the current threshold or before setLevel is called
	}

	if (serverContext?.sendNotification) {
		try {
			await serverContext.sendNotification({
				method: 'notifications/message',
				params: {
					level,
					logger,
					data,
				},
			});
		} catch {
			// Fallback to console if notification fails
			console.log(`[${level.toUpperCase()}] ${logger}:`, data);
		}
	} else {
		// Fallback to console if no server context
		console.log(`[${level.toUpperCase()}] ${logger}:`, data);
	}
}