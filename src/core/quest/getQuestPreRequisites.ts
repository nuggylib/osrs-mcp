export const getQuestPreRequisites = (requirements: string) => {
	// Parse quest requirements from the requirements string
	const questReqs: Record<string, { preReq?: string }> = {}

	// Quest requirements are typically at the beginning of the requirements string
	// They follow a pattern like:
	// * Completion of the following quests:
	// ** [[Quest Name]]
	// *** [[Nested Quest Name]] (prerequisite of the quest above)
	// **** [[Deeply Nested Quest]] (prerequisite of the quest above)

	// Split by lines and look for quest patterns
	const lines = requirements.split('\n')
	let inQuestSection = false
	const questStack: string[] = [] // Track parent quests by depth

	for (const line of lines) {
		// Check if we're entering the quest requirements section
		if (line.includes('Completion of the following quest')) {
			inQuestSection = true
			continue
		}

		// Check if we're leaving the quest section (when we hit skill requirements or items)
		if (inQuestSection) {
			// If we encounter template tags or "items =" we've left the quest section
			if (line.includes('<template>') || line.includes('items =')) {
				break // Exit the loop since we're done with quests
			}

			// Match quest names in double brackets
			// Pattern matches lines starting with asterisks followed by [[Quest Name]]
			const questMatch = line.match(/^(\*+)\s*\[\[([^\]]+)\]\]/)
			if (questMatch) {
				const asteriskCount = questMatch[1].length
				const questNameRaw = questMatch[2]
				// If there's a pipe, the actual quest name is before it
				const questName = questNameRaw.split('|')[0].trim()

				if (questName) {
					// Determine the depth level (** = 1, *** = 2, etc.)
					const depth = asteriskCount - 2

					// Update the stack to maintain parent quests at each level
					questStack[depth] = questName
					// Clear any deeper levels from previous iterations
					questStack.length = depth + 1

					// Determine the prerequisite (parent quest at depth - 1)
					const preReq = depth > 0 ? questStack[depth - 1] : undefined

					// Add the quest with its prerequisite
					questReqs[questName] = preReq ? { preReq } : {}
				}
			}
		}
	}

	return questReqs
}