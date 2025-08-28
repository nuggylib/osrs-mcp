import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

// TODO: Probably need to move this to Redis or some other caching mechanism (rather than in-memory).
// Map to store transports by session ID
export const transports = {} as {
	[key: string]: StreamableHTTPServerTransport
}
