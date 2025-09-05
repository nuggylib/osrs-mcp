// Legacy in-memory storage - kept for backwards compatibility
// New implementations should use redisStore

import { OAuthClient, OAuthToken, AuthCode } from '../../types/auth';

// These are deprecated - use redisStore instead
export const clients: Map<string, OAuthClient> = new Map();
export const tokens: Map<string, OAuthToken> = new Map();
export const authCodes: Map<string, AuthCode> = new Map();
