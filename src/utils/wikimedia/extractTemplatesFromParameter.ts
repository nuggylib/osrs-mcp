import { ParsedTemplate } from '../../types/wikimedia'
import { extractTemplatesFromString } from './extractTemplatesFromString'

/**
 * Extracts templates from a specific parameter value of a parsed template.
 * This is useful when a template parameter contains nested template elements.
 *
 * @param template - The parsed template containing the parameter
 * @param parameterName - The name of the parameter to extract templates from
 * @returns An array of parsed templates found in the parameter value
 */
export function extractTemplatesFromParameter(template: ParsedTemplate, parameterName: string): ParsedTemplate[] {
	const parameterValue = template.parameters[parameterName];
	if (!parameterValue) {
		return [];
	}

	return extractTemplatesFromString(parameterValue);
}