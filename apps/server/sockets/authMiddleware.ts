import type { SocketResponseBase } from '@monorepo/shared';
import { verifyToken } from '@Utils/jwt';
import logger from '@Utils/logger';
import { parse } from 'cookie';
import { SocketAuthError, SocketError } from 'errors/customSocketErrors';
import type { Socket } from 'socket.io';

export function authMiddleware(socket: Socket, next: (err?: Error) => void) {
    logger.info('Socket authmiddleware start');
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
        throw new SocketAuthError('Could not find cookie in headers');
    }
    const { accessToken, refreshToken } = parse(cookie);
    if (!accessToken && !refreshToken) {
        throw new SocketAuthError('Could not find jwt tokens in header');
    }
    if (accessToken) {
        const data = verifyToken(accessToken, 'access');
        if (!data) {
            throw new SocketAuthError('Invalid access token');
        }
        socket.data.user_id = data.user_id;
        logger.info('Socket authmiddleware success: access token valid');
        return next();
    }
    if (!refreshToken) {
        throw new SocketAuthError('Could not find refresh token');
    }

    const data = verifyToken(refreshToken, 'refresh');
    if (!data) {
        throw new SocketAuthError('Invalid refresh token');
    }

    return next(new SocketAuthError('TOKEN_EXPIRED'));

    // logger.info('Sending request to client for new refresh token');
    // socket.to(data.user_id).emit('refresh_token');
    // const timeout = setTimeout(() => {
    //     throw new SocketAuthError('New refresh token request failed: timeout expired');
    // }, 5000);

    // socket.once('token_refreshed', (response: SocketResponseBase) => {
    //     clearTimeout(timeout);
    //     logger.info('Response received from client');
    //     if (response.success) {
    //         logger.info('Get new refresh token success: recalling socket authMiddleware');
    //         return authMiddleware(socket, next);
    //     }
    //     throw new SocketAuthError('Get new refresh token failed');
    // })
}
