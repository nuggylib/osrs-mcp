import { ParsedTemplate } from '../../types/wikimedia'
import { toSnakeCase } from '../../utils/stringHelpers'

export const getRequiredSkills = (templates: ParsedTemplate[]) => {
	// Parse skill requirements from the parsed templates
	const skillReqs: Record<string, { name: string; level: number }> = {}

	// Filter for SCP templates (skill clickpic templates)
	const skillTemplates = templates.filter(template =>
		template.title === 'SCP' || template.title === 'Scp' || template.title === 'scp',
	)

	// Process each SCP template to extract skill and level
	for (const template of skillTemplates) {
		// SCP template typically has parameters:
		// 1 = skill name (e.g., "Mining", "Smithing")
		// 2 = skill level required (e.g., "50", "30")
		const skillName = template.parameters['1']?.trim()
		const levelStr = template.parameters['2']?.trim()

		if (skillName && levelStr) {
			const level = parseInt(levelStr, 10)
			if (!isNaN(level)) {
				const snakeCaseKey = toSnakeCase(skillName)

				// Store the skill requirement
				// If the same skill appears multiple times, keep the highest requirement
				if (!skillReqs[snakeCaseKey] || skillReqs[snakeCaseKey].level < level) {
					skillReqs[snakeCaseKey] = {
						name: skillName,
						level,
					}
				}
			}
		}
	}

	return skillReqs
}