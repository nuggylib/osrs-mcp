import z from 'zod';
import { QuestInfoToolResponse } from '../zod';

// Wrap the base QuestInfoToolResponse as a Zod Object so the type can be inferred and exported
export const QuestInfoToolResponseSchema = z.object(QuestInfoToolResponse);

// Export the inferred type
export type QuestInfoToolResponseType = z.infer<typeof QuestInfoToolResponseSchema>;
