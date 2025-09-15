export interface LogData {
	message: string;
	[key: string]: any;
}

/**
 * Send logging message through the current request's transport
 * @param serverContext - The context object from the tool callback's second parameter
 * @param level - Log level
 * @param logger - Logger name/category
 * @param data - Log data including message and any additional fields
 */
export async function sendLog(
	serverContext: any,
	level: 'debug' | 'info' | 'warn' | 'error',
	logger: string,
	data: LogData,
): Promise<void> {
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