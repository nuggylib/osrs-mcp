import { extractTemplatesFromString } from '../../utils/wikimedia/extractTemplatesFromString'

export const getSkillRequirements = (requirements: string) => {
	// Parse skill requirements from the requirements string
	const skillReqs: Record<string, number> = {}

	// Extract SCP templates from the requirements string
	const scpTemplates = extractTemplatesFromString(requirements)

	// Filter for SCP templates (skill clickpic templates)
	const skillTemplates = scpTemplates.filter(template =>
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
				// Store the skill requirement
				// If the same skill appears multiple times, keep the highest requirement
				if (!skillReqs[skillName] || skillReqs[skillName] < level) {
					skillReqs[skillName] = level
				}
			}
		}
	}

	return skillReqs
}