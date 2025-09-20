import { toSnakeCase } from '../../utils/stringHelpers.js'

export const getRecommendedItems = (recommended: string) => {
	// Parse recommended items from the recommended string
	const recommendedItems: Record<string, { name: string; count: number }> = {}

	// Split by lines to process each item entry
	const lines = recommended.split('\n')

	for (const line of lines) {
		// TODO: This is VERY hacky, but due to highly-dynamic nature of these list items, no simple regex fix is possible - look into agentic solution later.
		// Filter out non-item links (locations, skills, etc.)
		const nonItemKeywords = [
			'Fairy Rings', 'Fairy rings', 'fairy rings',
			'Balloon transport', 'Gnome Glider', 'gnome glider',
			'Eagle transport', 'eagle transport',
			'Grouping', 'grouping',
			'Multicombat', 'multicombat',
			'Brimhaven', 'Port Sarim', 'Draynor Village', 'Varrock', 'Barbarian Village',
			'Dwarven Mine', 'Taverley', 'White Wolf Mountain', 'Catherby', 'Seer\'s Village',
			'Fishing Guild', 'East Ardougne', 'Port Khazard', 'Ardougne Monastery',
			'Ranging Guild', 'Feldip Hills', 'H.A.M. Hideout', 'Edgeville Monastery',
			'Shilo Village',
		]

		// Find ALL [[item]] patterns in the line using a global regex
		const allMatches = line.matchAll(/\[\[([^\]]+)\]\]/g)

		for (const match of allMatches) {
			const itemName = match[1].split('|')[0].trim()

			// Skip non-item links
			if (itemName && !nonItemKeywords.some(keyword => itemName.includes(keyword))) {
				// Look for a number before this specific item mention
				const beforeItem = line.substring(0, match.index)
				const quantityMatch = beforeItem.match(/(\d+)\s*$/)
				const quantity = quantityMatch ? parseInt(quantityMatch[1], 10) : 1

				// Convert item name to snake_case for the key
				const itemKey = toSnakeCase(itemName)

				// Add to existing quantity if item already exists
				if (recommendedItems[itemKey]) {
					recommendedItems[itemKey].count += quantity
				} else {
					recommendedItems[itemKey] = {
						name: itemName,
						count: quantity,
					}
				}
			}
		}
	}

	return recommendedItems
}