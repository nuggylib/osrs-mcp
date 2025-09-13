import z from 'zod';

/**
 * The output schema for the Quest Info Tool response.
 */
export const QuestInfoToolResponse = {
	questGiver: z.string().describe('The name of the Quest giver.'),
	startingPoint: z.string().describe('The map coordinates of the Quest giver\'s location.'),
	difficulty: z.string().describe('The official difficulty of this Quest as-set by Jagex.'),
	length: z.string().describe('The official length of this Quest as-set by Jagex.'),
	requiredItems: z.record(
		z.string().describe('The Item name'),
		z.number().describe('The quantity required'),
	).describe('The Items required to complete this Quest.'),
	requiredQuests: z.record(
		z.string().describe('The Quest name'),
		z.object({
			preReq: z.string().optional().describe('The prerequisite quest that must be completed first'),
		}),
	).describe('The Quests that need to be completed before this Quest can be completed.'),
	requiredSkills: z.record(
		z.string().describe('The Skill name.'),
		z.number().describe('The required Skill level.'),
	).describe('The Skill levels required for to complete this Quest.'),
	recommendedItems: z.record(
		z.string().describe('The Item name'),
		z.number().describe('The quantity recommended'),
	).describe('The recommended Items for this Quest that will make completing it easier.'),
	recommendedSkills: z.record(
		z.string().describe('The Skill name'),
		z.number().describe('The recommended skill level'),
	).describe('The Skill levels recommended for this Quest that will make completing it easier.'),
	enemiesToDefeat: z.record(
		z.string().describe('The name of an enemy Monster'),
		z.object({
			levels: z.array(z.number()).describe('The possible levels of this enemy'),
		}),
	).describe('The enemies that need to be defeated to complete this Quest with their possible levels.'),
	questPoints: z.number().describe('The number of Quest Points this Quest awards on completion.'),
	itemRewards: z.record(
		z.string().describe('The name of the Item reward.'),
	).describe('The Items awarded to the player upon completion of this Quest with the number of how many of each are awarded.'),
	xpRewards: z.record(
		z.string().describe('The name of the Skill granted XP.'),
	).describe('The Skills which are granted reward XP upon completion of this Quest, as well as how much XP is granted for each.'),
	uniqueRewards: z.set(
		z.string().describe('A description of the unique reward.'),
	).describe('The list of unique rewards granted upon completion of this Quest.'),
}
