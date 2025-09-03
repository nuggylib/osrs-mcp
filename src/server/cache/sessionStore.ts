import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { redis, getJSON, setJSON, deleteKey, exists, TTL } from './redisClient';

const SESSION_KEY = (sessionId: string) => `session:transport:${sessionId}`;

export interface SessionMetadata {
	sessionId: string;
	createdAt: number;
	lastAccessedAt: number;
	clientInfo?: {
		userAgent?: string;
		ipAddress?: string;
	};
}

const activeTransports = new Map<string, StreamableHTTPServerTransport>();

export const sessionStore = {
	async get(sessionId: string): Promise<StreamableHTTPServerTransport | null> {
		if (activeTransports.has(sessionId)) {
			return activeTransports.get(sessionId) || null;
		}

		const metadata = await getJSON<SessionMetadata>(SESSION_KEY(sessionId));
		if (!metadata) {
			return null;
		}

		await setJSON(SESSION_KEY(sessionId), {
			...metadata,
			lastAccessedAt: Date.now(),
		}, TTL.SESSION);

		return null;
	},

	async set(sessionId: string, transport: StreamableHTTPServerTransport, clientInfo?: SessionMetadata['clientInfo']): Promise<void> {
		activeTransports.set(sessionId, transport);

		const metadata: SessionMetadata = {
			sessionId,
			createdAt: Date.now(),
			lastAccessedAt: Date.now(),
			clientInfo,
		};

		await setJSON(SESSION_KEY(sessionId), metadata, TTL.SESSION);
	},

	async has(sessionId: string): Promise<boolean> {
		if (activeTransports.has(sessionId)) {
			return true;
		}
		return exists(SESSION_KEY(sessionId));
	},

	async delete(sessionId: string): Promise<void> {
		const transport = activeTransports.get(sessionId);
		if (transport) {
			try {
				await transport.close();
			} catch (error) {
				console.error(`Error closing transport for session ${sessionId}:`, error);
			}
			activeTransports.delete(sessionId);
		}

		await deleteKey(SESSION_KEY(sessionId));
	},

	async clear(): Promise<void> {
		for (const [sessionId, transport] of activeTransports) {
			try {
				await transport.close();
			} catch (error) {
				console.error(`Error closing transport for session ${sessionId}:`, error);
			}
		}
		activeTransports.clear();

		const keys = await redis.keys(SESSION_KEY('*'));
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},

	getActiveTransport(sessionId: string): StreamableHTTPServerTransport | undefined {
		return activeTransports.get(sessionId);
	},

	setActiveTransport(sessionId: string, transport: StreamableHTTPServerTransport): void {
		activeTransports.set(sessionId, transport);
	},

	deleteActiveTransport(sessionId: string): void {
		activeTransports.delete(sessionId);
	},

	async updateLastAccessed(sessionId: string): Promise<void> {
		const metadata = await getJSON<SessionMetadata>(SESSION_KEY(sessionId));
		if (metadata) {
			await setJSON(SESSION_KEY(sessionId), {
				...metadata,
				lastAccessedAt: Date.now(),
			}, TTL.SESSION);
		}
	},
};

export const transports = new Proxy({} as { [key: string]: StreamableHTTPServerTransport }, {
	get(_target, prop: string) {
		return sessionStore.getActiveTransport(prop);
	},

	set(_target, prop: string, value: StreamableHTTPServerTransport) {
		sessionStore.setActiveTransport(prop, value);
		sessionStore.set(prop, value).catch(error => {
			console.error(`Failed to persist session ${prop}:`, error);
		});
		return true;
	},

	deleteProperty(_target, prop: string) {
		sessionStore.delete(prop).catch(error => {
			console.error(`Failed to delete session ${prop}:`, error);
		});
		return true;
	},

	has(_target, prop: string) {
		return sessionStore.getActiveTransport(prop) !== undefined;
	},
});