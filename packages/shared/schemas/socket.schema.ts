import { z, type ZodTypeAny } from 'zod';

export const socketLeaveLobbyDataSchema = z.object({
    lobbyId: z.string().trim(),
});
export const socketJoinLobbyDataSchema = socketLeaveLobbyDataSchema.extend({
    password: z.string().trim().optional(),
});

const successResponse = <T extends ZodTypeAny>(dataSchema: T) => {
    return z.object({
        success: z.literal(true),
        message: z.string().trim(),
        data: dataSchema,
    });
};

const errorResponse = z.object({
    success: z.literal(false),
    message: z.string().trim(),
});

export const socketResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.union([successResponse(dataSchema), errorResponse]);
