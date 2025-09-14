import Redis from 'ioredis';

// Either use the REDISCLOUD_URL, REDIS_URL variables, or fallback to local address
const REDIS_URL = process.env.REDISCLOUD_URL || process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(REDIS_URL, {
	retryStrategy: (times: number) => {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	maxRetriesPerRequest: 3,
	enableReadyCheck: true,
	lazyConnect: false,
});

redis.on('error', (error: Error) => {
	console.error('Redis connection error:', error);
});

redis.on('connect', () => {
	console.log('Redis connected successfully');
});

redis.on('ready', () => {
	console.log('Redis ready to accept commands');
});

export const TTL = {
	TOKEN: parseInt(process.env.REDIS_TTL_TOKEN || '3600', 10),
	AUTH_CODE: parseInt(process.env.REDIS_TTL_AUTH_CODE || '600', 10),
	CLIENT: parseInt(process.env.REDIS_TTL_CLIENT || '2592000', 10),
	SESSION: parseInt(process.env.REDIS_TTL_SESSION || '604800', 10),
};

export async function getJSON<T>(key: string): Promise<T | null> {
	const value = await redis.get(key);
	if (!value) {return null;}
	try {
		return JSON.parse(value) as T;
	} catch (error) {
		console.error(`Failed to parse JSON for key ${key}:`, error);
		return null;
	}
}

export async function setJSON<T>(key: string, value: T, ttl?: number): Promise<void> {
	const jsonValue = JSON.stringify(value);
	if (ttl) {
		await redis.set(key, jsonValue, 'EX', ttl);
	} else {
		await redis.set(key, jsonValue);
	}
}

export async function deleteKey(key: string): Promise<void> {
	await redis.del(key);
}

export async function exists(key: string): Promise<boolean> {
	const result = await redis.exists(key);
	return result === 1;
}

export async function getAllKeys(pattern: string): Promise<string[]> {
	return redis.keys(pattern);
}

export async function cleanupExpiredKeys(pattern: string): Promise<number> {
	const keys = await getAllKeys(pattern);
	let cleaned = 0;

	for (const key of keys) {
		const ttl = await redis.ttl(key);
		if (ttl === -2 || ttl === -1) {
			await deleteKey(key);
			cleaned++;
		}
	}

	return cleaned;
}