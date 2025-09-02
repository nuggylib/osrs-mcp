// In-memory storage for OAuth clients and tokens

import { OAuthClient, OAuthToken, AuthCode } from '../../types/auth';

// In production, use a proper database
export const clients: Map<string, OAuthClient> = new Map();
export const tokens: Map<string, OAuthToken> = new Map();
export const authCodes: Map<string, AuthCode> = new Map();
