import { verifyToken } from '@Utils/jwt';
import logger from '@Utils/logger';
import { parse } from 'cookie';
import { AuthError } from 'errors/customErrors';
import type { Socket } from 'socket.io';

export function authMiddleware(socket: Socket, next: (err?: Error) => void) {
    logger.info('Socket authmiddleware start');
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) {
        throw new AuthError('Could not find cookie in headers');
    }
    const { accessToken, refreshToken } = parse(cookie);
    console.log(`Access: ${!!accessToken}; Refresh: ${!!refreshToken}`);
    if (!accessToken && !refreshToken) {
        throw new AuthError('Could not find jwt tokens in header');
    }
    if (!accessToken && refreshToken) {
        const data = verifyToken(refreshToken, 'refresh');
        if (!data) {
            throw new AuthError('Could not verify refresh token');
        }
        socket.data.user_id = data.user_id;
        //TODO: send request to client to refresh access token;
        next();
    }
    if (!accessToken) {
        throw new AuthError('Could not find access token');
    }
    const data = verifyToken(accessToken, 'access');
    if (!data) {
        throw new AuthError('Invalid access token');
    }

    socket.data.user_id = data.user_id;
    logger.info('Socket authMiddleware success');
    next();
}
