import { ParsedTemplate } from '../../types/wikimedia'
import { toSnakeCase } from '../../utils/stringHelpers'

export const getRecommendedSkills = (templates: ParsedTemplate[]) => {
	// Parse recommended skills from the parsed templates
	const recommendedSkills: Record<string, { name: string; level: number }> = {}

	// Filter for SCP templates (skill clickpic templates) - exact match only
	const skillTemplates = templates.filter(template => template.title === 'SCP')

	// Process each SCP template to extract skill and level
	for (const template of skillTemplates) {
		const skillName = template.parameters['1']?.trim()
		const levelStr = template.parameters['2']?.trim()

		if (skillName && levelStr) {
			const level = parseInt(levelStr, 10)
			if (!isNaN(level)) {
				const snakeCaseKey = toSnakeCase(skillName)

				// Store the recommended skill level
				// If the same skill appears multiple times, keep the highest
				if (!recommendedSkills[snakeCaseKey] || recommendedSkills[snakeCaseKey].level < level) {
					recommendedSkills[snakeCaseKey] = {
						name: skillName,
						level,
					}
				}
			}
		}
	}

	return recommendedSkills
}