import { toSnakeCase } from '../../utils/stringHelpers'

export const getEnemiesToKill = (kills: string) => {
	// Parse enemies to defeat from the kills string
	const enemiesToDefeat: Record<string, { name: string; levels: number[] }> = {}

	// Split by lines to process each enemy entry
	const lines = kills.split('\n')

	for (const line of lines) {
		// Match patterns like "* [[Slagilith]] ''(level 92)''" or "* [[Dwarf gang member]]s ''(level 44/48/49)'' ([[Multicombat area]])"
		// The pattern looks for lines starting with asterisks followed by [[Enemy Name]]
		const enemyMatch = line.match(/^\*+\s*\[\[([^\]]+)\]\]/)
		if (enemyMatch) {
			const enemyNameRaw = enemyMatch[1]
			// If there's a pipe, the actual enemy name is before it
			const enemyName = enemyNameRaw.split('|')[0].trim()

			if (enemyName) {
				// Extract level information from the line
				// Look for patterns like ''(level 92)'' or ''(level 44/48/49)''
				const levelMatch = line.match(/''?\(level\s+([^)]+)\)''?/)
				const levels: number[] = []

				if (levelMatch) {
					const levelStr = levelMatch[1]
					// Handle multiple levels separated by slashes
					const levelParts = levelStr.split('/')
					for (const part of levelParts) {
						const level = parseInt(part.trim(), 10)
						if (!isNaN(level)) {
							levels.push(level)
						}
					}
				}

				// If we found levels, use them; otherwise default to empty array
				const snakeCaseKey = toSnakeCase(enemyName)
				enemiesToDefeat[snakeCaseKey] = {
					name: enemyName,
					levels,
				}
			}
		}
	}

	return enemiesToDefeat
}