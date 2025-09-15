import { ParsedTemplate } from '../../types/wikimedia';
import { JSDOM } from 'jsdom'

/**
 * Extracts templates from a string containing XML content.
 * This is useful when you have a partial XML string (like from a template parameter)
 * that contains nested template elements.
 *
 * @param xmlString - The string containing XML content with template elements
 * @returns An array of parsed templates found in the string
 */
export function extractTemplatesFromString(xmlString: string): ParsedTemplate[] {
	// Wrap the string in a root element to ensure valid XML
	const wrappedXml = `<root>${xmlString}</root>`;
	const jsDom = new JSDOM(wrappedXml, {
		contentType: 'text/xml',
	})

	// Check for parsing errors
	const parserError = jsDom.window.document.querySelector('parsererror');
	if (parserError) {
		console.warn('XML parsing error in extractTemplatesFromString:', parserError.textContent);
		return [];
	}

	// Find all template elements
	const templates = jsDom.window.document.querySelectorAll('template');

	return Array.from(templates).map(template => {
		const title = template.querySelector('title')?.textContent?.trim() || '';
		const lineStart = template.getAttribute('lineStart');
		const parameters: Record<string, string> = {};

		template.querySelectorAll('part').forEach(part => {
			const nameEl = part.querySelector('name');
			const valueEl = part.querySelector('value');

			const name = nameEl?.textContent?.trim() || nameEl?.getAttribute('index') || '';
			const value = valueEl?.textContent?.trim() || '';

			if (name) {
				parameters[name] = value;
			}
		});

		return {
			title,
			parameters,
			...(lineStart && { lineStart: parseInt(lineStart) }),
		};
	});
}