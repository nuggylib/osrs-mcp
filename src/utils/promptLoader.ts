import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Loads a prompt from a text file from the prompts directory.
 *
 * @param category - The category/subdirectory of the prompt (e.g., 'wiki')
 * @param promptFileName - The name of the prompt file (e.g., 'search.txt')
 * @returns The contents of the prompt file as a string
 *
 * @example
 * // In src/tools/wiki/searchWikiForPage.ts
 * const description = loadPrompt('wiki', 'search.txt');
 */
export function loadPrompt(category: string, promptFileName: string): string {
	const promptPath = join(process.cwd(), 'prompts', category, promptFileName);

	try {
		return readFileSync(promptPath, 'utf-8').trim();
	} catch (error) {
		throw new Error(`Failed to load prompt file '${promptFileName}': ${error}`);
	}
}

/**
 * Loads a prompt from a text file with template variable replacement.
 *
 * @param category - The category/subdirectory of the prompt (e.g., 'wiki')
 * @param promptFileName - The name of the prompt file (e.g., 'search.txt')
 * @param variables - Object containing variables to replace in the template
 * @returns The processed prompt string with variables replaced
 *
 * @example
 * // In src/tools/wiki/searchWikiForPage.ts
 * const description = loadPromptWithVariables(
 *   'wiki',
 *   'search.txt',
 *   { toolName: 'search_osrs_wiki', maxResults: 10 }
 * );
 */
export function loadPromptWithVariables(
	category: string,
	promptFileName: string,
	variables: Record<string, any>,
): string {
	let prompt = loadPrompt(category, promptFileName);

	// Replace {{variableName}} with actual values
	Object.entries(variables).forEach(([key, value]) => {
		const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
		prompt = prompt.replace(pattern, String(value));
	});

	return prompt;
}