import { OAuthClient, OAuthToken, AuthCode } from '../../types/auth';
import { redis, getJSON, setJSON, deleteKey, exists, TTL } from './redisClient';

const KEYS = {
	CLIENT: (id: string) => `oauth:client:${id}`,
	TOKEN: (token: string) => `oauth:token:${token}`,
	AUTH_CODE: (code: string) => `oauth:authcode:${code}`,
};

export const redisClients = {
	async get(clientId: string): Promise<OAuthClient | undefined> {
		const client = await getJSON<OAuthClient>(KEYS.CLIENT(clientId));
		return client || undefined;
	},

	async set(clientId: string, client: OAuthClient): Promise<void> {
		await setJSON(KEYS.CLIENT(clientId), client, TTL.CLIENT);
	},

	async has(clientId: string): Promise<boolean> {
		return exists(KEYS.CLIENT(clientId));
	},

	async delete(clientId: string): Promise<void> {
		await deleteKey(KEYS.CLIENT(clientId));
	},

	async clear(): Promise<void> {
		const keys = await redis.keys(KEYS.CLIENT('*'));
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},
};

export const redisTokens = {
	async get(token: string): Promise<OAuthToken | undefined> {
		const tokenData = await getJSON<OAuthToken>(KEYS.TOKEN(token));
		return tokenData || undefined;
	},

	async set(token: string, tokenData: OAuthToken): Promise<void> {
		const ttl = tokenData.expires_at
			? Math.max(0, Math.floor((tokenData.expires_at - Date.now()) / 1000))
			: TTL.TOKEN;
		await setJSON(KEYS.TOKEN(token), tokenData, ttl);
	},

	async has(token: string): Promise<boolean> {
		return exists(KEYS.TOKEN(token));
	},

	async delete(token: string): Promise<void> {
		await deleteKey(KEYS.TOKEN(token));
	},

	async clear(): Promise<void> {
		const keys = await redis.keys(KEYS.TOKEN('*'));
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},
};

export const redisAuthCodes = {
	async get(code: string): Promise<AuthCode | undefined> {
		const authCode = await getJSON<AuthCode>(KEYS.AUTH_CODE(code));
		return authCode || undefined;
	},

	async set(code: string, authCode: AuthCode): Promise<void> {
		await setJSON(KEYS.AUTH_CODE(code), authCode, TTL.AUTH_CODE);
	},

	async has(code: string): Promise<boolean> {
		return exists(KEYS.AUTH_CODE(code));
	},

	async delete(code: string): Promise<void> {
		await deleteKey(KEYS.AUTH_CODE(code));
	},

	async clear(): Promise<void> {
		const keys = await redis.keys(KEYS.AUTH_CODE('*'));
		if (keys.length > 0) {
			await redis.del(...keys);
		}
	},
};

export { redis } from './redisClient';