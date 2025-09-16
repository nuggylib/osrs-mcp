import z from 'zod';
import { QuestInfoToolResponse, QuestRequirement, QuestRequirementsRecord } from '../zod';

// Wrap the base QuestInfoToolResponse as a Zod Object so the type can be inferred and exported
export const QuestInfoToolResponseSchema = z.object(QuestInfoToolResponse);

// Export the inferred type
export type QuestInfoToolResponseType = z.infer<typeof QuestInfoToolResponseSchema>;

export type QuestRequirementType = z.infer<typeof QuestRequirement>;
export type QuestRequirementsRecordType = z.infer<typeof QuestRequirementsRecord>