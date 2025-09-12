// TODO: Implement tooling to generate types from Zod validators
// This type should align with the output schema for the getQuestInfo tool
export type QuestInfoToolResponse = {
	questGiver: string,
	startingPoint: string,
	difficulty: string,
	developer: string,
	length: string,
	itemReqs: {
		[itemName: string]: number
	},
	questReqs: {
		[questName: string]: {
			preReq?: string
		}
	},
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
