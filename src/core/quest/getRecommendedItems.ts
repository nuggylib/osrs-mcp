export const getRecommendedItems = (recommended: string) => {
	// Parse recommended items from the recommended string
	const recommendedItems: Record<string, number> = {}

	// Split by lines to process each item entry
	const lines = recommended.split('\n')

	for (const line of lines) {
		// Match patterns like "4 [[steel bar]]s" or "[[Bronze bar]]" or "2 [[Guam leaves]]"
		// First try to match with a number prefix
		const quantityMatch = line.match(/(\d+)\s*\[\[([^\]]+)\]\]/)
		if (quantityMatch) {
			const quantity = parseInt(quantityMatch[1], 10)
			const itemName = quantityMatch[2].split('|')[0].trim()

			// Filter out non-item links (locations, skills, etc.)
			const nonItemKeywords = [
				'Fairy Rings', 'Fairy rings', 'fairy rings',
				'Balloon transport', 'Gnome Glider', 'gnome glider',
				'Eagle transport', 'eagle transport',
				'Grouping', 'grouping',
				'Multicombat', 'multicombat',
			]

			if (itemName && !isNaN(quantity) &&
						!nonItemKeywords.some(keyword => itemName.includes(keyword))) {
				// Add to existing quantity if item already exists
				recommendedItems[itemName] = (recommendedItems[itemName] || 0) + quantity
			}
		} else {
			// Try to match without a number (default to 1)
			const simpleMatch = line.match(/\[\[([^\]]+)\]\]/)
			if (simpleMatch) {
				const itemName = simpleMatch[1].split('|')[0].trim()

				// Filter out non-item links
				const nonItemKeywords = [
					'Fairy Rings', 'Fairy rings', 'fairy rings',
					'Balloon transport', 'Gnome Glider', 'gnome glider',
					'Eagle transport', 'eagle transport',
					'Grouping', 'grouping',
					'Multicombat', 'multicombat',
				]

				if (itemName &&
							!nonItemKeywords.some(keyword => itemName.includes(keyword))) {
					// Add 1 to existing quantity if item already exists
					recommendedItems[itemName] = (recommendedItems[itemName] || 0) + 1
				}
			}
		}
	}

	return recommendedItems
}