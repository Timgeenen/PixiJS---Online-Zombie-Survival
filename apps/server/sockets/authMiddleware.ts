import { verifyToken } from '@Utils/jwt';
import logger from '@Utils/logger';
import { parse } from 'cookie';
import { SocketAuthError } from 'errors/customSocketErrors';
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
}
