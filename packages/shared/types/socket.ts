import type { z } from 'zod';
import {
    baseLobbyBaseSchema,
    baseResponse,
    errorResponse,
    socketJoinLobbyDataSchema,
    socketLeaveLobbyDataSchema,
    socketResponseSchema,
} from '../schemas';

export type SocketResponseBase = z.infer<typeof baseResponse>;
export type SocketErrorResponse = z.infer<typeof errorResponse>;
export type SocketLeaveLobbyData = z.infer<typeof socketLeaveLobbyDataSchema>;
export type SocketJoinLobbyData = z.infer<typeof socketJoinLobbyDataSchema>;

const joinRoomResponseSchema = socketResponseSchema(baseLobbyBaseSchema);
export type SocketJoinLobbyResponse = z.infer<typeof joinRoomResponseSchema>;
