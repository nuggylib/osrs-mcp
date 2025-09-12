export type QuestInfoToolResponse = {
	startingPoint: string,
	difficulty: string,
	developer: string,
	length: string,
	itemReqs: string[],
	questReqs: string[],
	skillReqs: {
		[skillName: string]: number
	},
	recommendedItems: {
		[itemName: string]: number
	},
	recommendedSkills: {
		[skillName: string]: number
	},
	enemiesToDefeat: string[],
	questPoints: number,
	itemRewards: {
		[itemName: string]: number
	},
	xpRewards: {
		[skillName: string]: number
	},
	uniqueRewards: string[],
}
