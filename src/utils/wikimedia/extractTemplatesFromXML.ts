import { ParsedTemplate } from '../../types/wikimedia';
import { JSDOM } from 'jsdom'

export function extractTemplatesFromXML(jsDom: JSDOM): ParsedTemplate[] {
	const templates = jsDom.window.document.querySelectorAll('template');

	return Array.from(templates).map(template => {
		const title = template.querySelector('title')?.textContent?.trim() || '';
		const lineStart = template.getAttribute('lineStart');
		const parameters: Record<string, string> = {};

		template.querySelectorAll('part').forEach(part => {
			const nameEl = part.querySelector('name');
			const valueEl = part.querySelector('value');

			const name = nameEl?.textContent?.trim() || nameEl?.getAttribute('index') || '';
			// Use innerHTML to preserve nested XML structure instead of textContent
			const value = valueEl?.innerHTML?.trim() || '';

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
