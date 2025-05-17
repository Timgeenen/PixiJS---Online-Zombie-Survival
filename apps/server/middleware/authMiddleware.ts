import { setNewToken, verifyToken } from '@Utils/jwt';
import { AuthError } from 'errors/customErrors';
import type { NextFunction, Request, Response } from 'express';
import { findUserById } from 'services/userService';

export default async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
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
        next();
    } catch (error) {
        next(error);
    }
}
