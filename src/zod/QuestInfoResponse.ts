import z from 'zod';

/**
 * Flexible type to accommodate the possible data fields that can be
 * set for a Quest requirement.
 */
export const QuestRequirement = z.record(
	z.string().describe('The key for the data.'),
	z.record(
		z.string(),
		z.record(
			z.string(),
			z.any(),
		).or(z.array(z.string().or(z.number()))).or(z.string()).or(z.number()),
	).describe('The data for the Quest requirement.'),
).describe('The general shape of requirement data for a Quest (Skills, Items and Quests).')

/**
 * The output schema for the Quest Info Tool response.
 */
export const QuestInfoToolResponse = {
	name: z.string().describe('The name of the Quest.'),
	questNumber: z.number().describe('The number of the Quest.'),
	featuredImageName: z.string().describe('The name of the Wiki page featured image for this Quest.'),
	releaseDay: z.number().describe('The numeric day (of the month) within the release month that this Quest was added to the game.'),
	releaseMonth: z.string().describe('The release month of when this Quest was added to the game.'),
	releaseYear: z.string().describe('The release year of when this Quest was added to the game.'),
	update: z.string().describe('The title of the update message for the update that added this Quest to the game.'),
	series: z.string().describe('The name of the Quest Series that this Quest belongs to, or "None" if not part of one.'),
	developer: z.string().describe('The name of the lead developer responsible for creating this Quest.'),
	membersOnly: z.boolean().describe('Whether or not this Quest is members-only content.'),
	questGiver: z.string().describe('The name of the Quest giver.'),
	startingPoint: z.string().describe('The map coordinates of the Quest giver\'s location.'),
	difficulty: z.string().describe('The official difficulty of this Quest as-set by Jagex.'),
	aka: z.string().describe('The alternative name for this Quest.'),
	length: z.string().describe('The official length of this Quest as-set by Jagex.'),
	requiredItems: z.array(QuestRequirement).describe('The Items required to complete this Quest.'),
	requiredQuests: z.array(QuestRequirement).describe('The Quests that need to be completed before this Quest can be completed.').optional(),
	requiredSkills: z.array(QuestRequirement).describe('The Skill levels required for to complete this Quest.').optional(),
	recommendedItems: z.record(
		z.string().describe('The Item name.'),
		z.number().describe('The quantity recommended.'),
	).describe('The recommended Items for this Quest that will make completing it easier.').optional(),
	recommendedSkills: z.record(
		z.string().describe('The Skill name.'),
		z.number().describe('The recommended skill level.'),
	).describe('The Skill levels recommended for this Quest that will make completing it easier.').optional(),
	enemiesToDefeat: z.record(
		z.string().describe('The name of an enemy Monster.'),
		z.object({
			levels: z.array(z.number()).describe('The possible levels of this enemy.'),
		}),
	).describe('The enemies that need to be defeated to complete this Quest with their possible levels.').optional(),
	questPoints: z.number().describe('The number of Quest Points this Quest awards on completion.'),
	itemRewards: z.record(
		z.string().describe('The name of the Item reward.'),
	).describe('The Items awarded to the player upon completion of this Quest with the number of how many of each are awarded.').optional(),
	xpRewards: z.record(
		z.string().describe('The name of the Skill granted XP.'),
	).describe('The Skills which are granted reward XP upon completion of this Quest, as well as how much XP is granted for each.'),
	uniqueRewards: z.set(
		z.string().describe('A description of the unique reward.'),
	).describe('The list of unique rewards granted upon completion of this Quest.').optional(),
}
