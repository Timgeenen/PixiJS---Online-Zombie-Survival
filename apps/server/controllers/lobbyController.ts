import { lobbySettingsSchema } from '@monorepo/shared/schemas';
import type { AuthenticatedRequest } from '@Types/api';
import type { DBLobbyInput } from '@Types/db';
import { sendSuccess } from '@Utils/apiResponse';
import { hashPassword } from '@Utils/hash';
import logger from '@Utils/logger';
import { AuthError, BadRequestError } from 'errors/customErrors';
import type { Response } from 'express';
import { DBLobbyInputSchema } from 'schemas/db.schemas';
import { createNewLobby } from 'services/lobbyService';
import { findUserById } from 'services/userService';

export async function createLobby(req: AuthenticatedRequest, res: Response) {
    logger.info('Create new lobby request received');
    if (!req.user_id) {
        throw new AuthError('No user id found in request');
    }

    const settings = req.body;
    const result = lobbySettingsSchema.safeParse(settings);
    if (result.error) {
        logger.error(result.error);
        throw new BadRequestError('Invalid lobby settings data');
    }

    const user = await findUserById(req.user_id);
    if (!user) {
        throw new AuthError('Invalid user id');
    }

    if (result.data.gameMode === 'multiplayer' && result.data.isPrivate) {
        if (!result.data.password) {
            throw new BadRequestError('Missing password');
        }
        result.data.password = await hashPassword(result.data.password);
    }

    const data: DBLobbyInput = {
        settings: result.data,
        leader: req.user_id,
        players: [
            {
                _id: req.user_id,
                username: user.username,
                stats: user.stats,
            },
        ],
    };

    const validData = DBLobbyInputSchema.safeParse(data);
    if (validData.error) {
        logger.error(validData.error);
        throw new BadRequestError('Invalid lobby data');
    }

    const lobby = await createNewLobby(validData.data);

    logger.info('New lobby has been created');
    sendSuccess(res, 201, 'New lobby has been created', lobby);
}

// export async function getLobbyById(req: AuthenticatedRequest, res: Response) {
//     const { lobbyID } = req.params;
//     logger.info(`[user: ${req.user_id}] get lobby request [lobby: ${lobbyID}]`);
//     if (!lobbyID) {
//         throw new BadRequestError('No lobby ID provided');
//     }
//     if (!req.user_id) {
//         throw new AuthError('Unauthorized access: no user id found in request');
//     }
//     const lobby = await findLobbyById(lobbyID);
//     if (!lobby) {
//         throw new NotFoundError(`[lobby: ${lobbyID}] not found in database`);
//     }
//     if (!lobby.players.some((player) => player._id === req.user_id)) {
//         throw new BadRequestError(`[player: ${req.user_id}] not found in player list`);
//     }

//     logger.info(`[lobby: ${lobbyID}] get request success`);
//     sendSuccess(res, 200, 'Successfully fetched lobby', lobby);
// }
