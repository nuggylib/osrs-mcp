import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads a prompt from a text file relative to a base directory.
 * 
 * @param promptFileName - The name of the prompt file (e.g., 'search.txt')
 * @param baseDir - The base directory path (typically __dirname from the calling module)
 * @returns The contents of the prompt file as a string
 * 
 * @example
 * // In src/tools/wiki/searchWikiForPage.ts
 * const description = loadPrompt('search.txt', __dirname);
 */
export function loadPrompt(promptFileName: string, baseDir: string): string {
	const promptPath = join(baseDir, 'prompts', promptFileName);
	
	try {
		return readFileSync(promptPath, 'utf-8').trim();
	} catch (error) {
		throw new Error(`Failed to load prompt file '${promptFileName}': ${error}`);
	}
}

/**
 * Loads a prompt from a text file with template variable replacement.
 * 
 * @param promptFileName - The name of the prompt file (e.g., 'search.txt')
 * @param baseDir - The base directory path (typically __dirname from the calling module)
 * @param variables - Object containing variables to replace in the template
 * @returns The processed prompt string with variables replaced
 * 
 * @example
 * // In src/tools/wiki/searchWikiForPage.ts
 * const description = loadPromptWithVariables(
 *   'search.txt',
 *   __dirname,
 *   { toolName: 'search_osrs_wiki', maxResults: 10 }
 * );
 */
export function loadPromptWithVariables(
	promptFileName: string,
	baseDir: string,
	variables: Record<string, any>
): string {
	let prompt = loadPrompt(promptFileName, baseDir);
	
	// Replace {{variableName}} with actual values
	Object.entries(variables).forEach(([key, value]) => {
		const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
		prompt = prompt.replace(pattern, String(value));
	});
	
	return prompt;
}