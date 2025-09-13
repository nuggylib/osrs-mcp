import z from 'zod';
import { QuestInfoToolResponse } from '../zod';

export const QuestInfoToolResponseSchema = z.object(QuestInfoToolResponse);

// Export the inferred type
export type QuestInfoToolResponseType = z.infer<typeof QuestInfoToolResponseSchema>;
