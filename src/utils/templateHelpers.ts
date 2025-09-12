import { BaseOSRSWikiTemplate } from '../types/osrsWiki.js';
import { ParsedTemplate } from '../types/wikimedia.js';

export function findTemplates<T extends BaseOSRSWikiTemplate>(
	parsedTemplates: ParsedTemplate[],
	targetTitle: string,
) {
	return parsedTemplates.filter((template): template is T =>
		template.title === targetTitle,
	);
}
