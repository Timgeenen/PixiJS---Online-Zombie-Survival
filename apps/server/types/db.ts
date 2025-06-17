import type mongoose from 'mongoose';
import type { Date, Document, ObjectId } from 'mongoose';
import type { DBLobbyInputSchema, DBUserInputSchema } from 'schemas/db.schemas';
import { z } from 'zod';

export interface DBMetaData {
    _id: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export type DBLobbyInput = z.infer<typeof DBLobbyInputSchema>;
export type DBLobby = DBLobbyInput & DBMetaData;
export type DBUserInput = z.infer<typeof DBUserInputSchema>;
export type DBUser = DBUserInput & DBMetaData;
