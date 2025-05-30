import type { AuthenticatedRequest } from '@Types/api';
import { setNewToken, verifyToken } from '@Utils/jwt';
import logger from '@Utils/logger';
import { AuthError } from 'errors/customErrors';
import type { NextFunction, Request, Response } from 'express';
import { findUserById } from 'services/userService';

export default async function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
) {
    try {
        logger.info('Validating Tokens');
        const { accessToken, refreshToken } = req.cookies;

        if (!accessToken && !refreshToken) {
            throw new AuthError('No JWT tokens found in cookies');
        }

        if (!accessToken) {
            const { user_id } = verifyToken(refreshToken, 'refresh');
            if (!user_id) {
                throw new AuthError('Could not verify token of type: refresh');
            }

            const user = await findUserById(user_id);
            if (!user) {
                throw new AuthError(`Could not find user: ${user_id} in database`);
            }

            setNewToken(res, user_id, 'access');
            req.user_id = user._id.toString();
            logger.info('Verified refreshToken and signed new accessToken');
            next();
        }

        const { user_id } = verifyToken(accessToken, 'access');
        if (!user_id) {
            throw new AuthError('Could not verify token of type: access');
        }

        const user = await findUserById(user_id);
        if (!user) {
            throw new AuthError(`Could not find user: ${user_id} in database`);
        }
        req.user_id = user._id.toString();
        logger.info('Verified accessToken');
        next();
    } catch (error) {
        next(error);
    }
}
