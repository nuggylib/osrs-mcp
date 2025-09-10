export type ParsedTemplate = {
	/**
	 * The title of the template.
	 */
	title: string;
	/**
	 * The "values" of the template structured as:
	 *
	 * ```json
	 * {
	 *    "property": "value"
	 * }
	 * ```
	 */
	parameters: Record<string, string>;
	// TODO: Determine if we need this
	lineStart?: number;
}
