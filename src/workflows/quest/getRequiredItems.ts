const toSnakeCase = (str: string): string => {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
}

const getItemCount = (item: any): number => {
	return typeof item === 'object' && item !== null && 'count' in item && typeof item.count === 'number'
		? item.count
		: 0
}

export const getRequiredItems = (items: string) => {
	// Parse item requirements from the items string
	const itemReqs: Record<string, Record<string, string | number>> = {}
	console.log('Getting required items from requirements string:', items)

	// The items string is already the content we need to parse
	// Split by lines to process each item entry
	const lines = items.split('\n')
	console.log('Lines: ', lines)

	for (const line of lines) {
		console.log('Evaluating line: ', line)
		// Match patterns like "4 [[steel bar]]s" or "[[Bronze bar]]" or "2 [[Guam leaves]]"
		// First try to match with a number prefix
		const quantityMatch = line.match(/(\d+)\s*\[\[([^\]]+)\]\]/)
		if (quantityMatch) {
			const quantity = parseInt(quantityMatch[1], 10)
			const itemName = quantityMatch[2].split('|')[0].trim()
			if (itemName && !isNaN(quantity)) {
				const snakeKey = toSnakeCase(itemName)
				// Add to existing quantity if item already exists
				const currentCount = getItemCount(itemReqs[snakeKey])
				itemReqs[snakeKey] = {
					name: itemName,
					count: currentCount + quantity,
				}
			}
		} else {
			// Try to match without a number (default to 1)
			const simpleMatch = line.match(/\[\[([^\]]+)\]\]/)
			if (simpleMatch) {
				const itemName = simpleMatch[1].split('|')[0].trim()
				if (itemName) {
					const snakeKey = toSnakeCase(itemName)
					// Add 1 to existing quantity if item already exists
					const currentCount = getItemCount(itemReqs[snakeKey])
					itemReqs[snakeKey] = {
						name: itemName,
						count: currentCount + 1,
					}
				}
			}
		}
	}

	return itemReqs
}