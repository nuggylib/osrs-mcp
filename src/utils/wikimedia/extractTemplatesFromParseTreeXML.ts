import { ParsedTemplate } from '../../types/wikimedia';

/**
 * Extracts templates from a action=parse, props=parsetree response from the OSRS WIKI API.
 * The response must be in an XML format.
 *
 * @param xmlDoc The XML-formatted API response to extract templates from.
 * @returns Array of ParsedTemplate objects; one for each template extracted.
 */
export function extractTemplatesFromParseTreeXML(xmlDoc: XMLDocument): ParsedTemplate[] {
	const templates = xmlDoc.querySelectorAll('template');

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
