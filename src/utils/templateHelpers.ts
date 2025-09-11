import { ParsedTemplate } from '../types/wikimedia.js';

export function findTemplates<T extends ParsedTemplate>(
	parsedTemplates: ParsedTemplate[],
	targetTitle: string
): T[] {
	return parsedTemplates.filter(template => template.title === targetTitle) as T[];
}