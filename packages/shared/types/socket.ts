import type { z } from 'zod';
import {
    baseLobbyBaseSchema,
    socketJoinLobbyDataSchema,
    socketLeaveLobbyDataSchema,
    socketResponseSchema,
} from '../schemas';

// export type SocketRoomTypes = 'lobby'
export type SocketLeaveLobbyData = z.infer<typeof socketLeaveLobbyDataSchema>;
export type SocketJoinLobbyData = z.infer<typeof socketJoinLobbyDataSchema>;

const joinRoomResponseSchema = socketResponseSchema(baseLobbyBaseSchema);
export type SocketJoinLobbyResponse = z.infer<typeof joinRoomResponseSchema>;
