export const getRequiredItems = (requirements: string) => {
// Parse item requirements from the requirements string
	const itemReqs: Record<string, number> = {}

	// Extract the items section which starts with "items ="
	const itemsMatch = requirements.match(/items\s*=\s*=\s*<value>([\s\S]*?)(?:<\/value>|$)/)
	if (itemsMatch) {
		const itemsSection = itemsMatch[1]
		// Split by lines to process each item entry
		const lines = itemsSection.split('\n')

		for (const line of lines) {
			// Match patterns like "4 [[steel bar]]s" or "[[Bronze bar]]" or "2 [[Guam leaves]]"
			// First try to match with a number prefix
			const quantityMatch = line.match(/(\d+)\s*\[\[([^\]]+)\]\]/)
			if (quantityMatch) {
				const quantity = parseInt(quantityMatch[1], 10)
				const itemName = quantityMatch[2].split('|')[0].trim()
				if (itemName && !isNaN(quantity)) {
					// Add to existing quantity if item already exists
					itemReqs[itemName] = (itemReqs[itemName] || 0) + quantity
				}
			} else {
				// Try to match without a number (default to 1)
				const simpleMatch = line.match(/\[\[([^\]]+)\]\]/)
				if (simpleMatch) {
					const itemName = simpleMatch[1].split('|')[0].trim()
					if (itemName) {
						// Add 1 to existing quantity if item already exists
						itemReqs[itemName] = (itemReqs[itemName] || 0) + 1
					}
				}
			}
		}
	}

	return itemReqs
}