import crypto from 'crypto';

// Generate secure random strings
export function generateSecureToken(length: number = 32): string {
	return crypto.randomBytes(length).toString('base64url');
}

// Validate PKCE code challenge
export function validatePKCE(codeVerifier: string, codeChallenge: string, method: string = 'S256'): boolean {
	if (method !== 'S256') {return false;}

	const hash = crypto.createHash('sha256').update(codeVerifier).digest();
	const challenge = hash.toString('base64url');
	return challenge === codeChallenge;
}

// Validate redirect URI
export function isValidRedirectUri(uri: string): boolean {
	try {
		const url = new URL(uri);
		// Allow localhost or HTTPS URLs as per MCP spec
		return url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.protocol === 'https:';
	} catch {
		return false;
	}
}

export const setTokenExpiration = (hours: number, days: number) => {
	const oneHour = (60 * 60 * 1000)
	const totalHours = oneHour * hours
	const totalDays = (24 * oneHour) * days
	return Date.now() + totalHours + totalDays
}