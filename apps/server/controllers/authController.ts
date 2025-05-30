import { loginCredentialsSchema, registerCredentialsSchema } from '@monorepo/shared';
import type { AuthenticatedRequest } from '@Types/api';
import { sendSuccess } from '@Utils/apiResponse';
import { comparePassword, hashPassword } from '@Utils/hash';
import { setNewToken } from '@Utils/jwt';
import logger from '@Utils/logger';
import {
    AuthError,
    BadRequestError,
    ConflictError,
    InternalServerError,
    NotFoundError,
} from 'errors/customErrors';
import type { Request, Response } from 'express';
import {
    createNewUser,
    findUserByUsername,
    isEmailTaken,
    isUsernameTaken,
} from 'services/userService';

export async function login(req: Request, res: Response) {
    logger.info('Logging in user');
    const credentials = req.body;
    const result = loginCredentialsSchema.safeParse(credentials);
    if (result.error) {
        logger.error(result.error);
        throw new BadRequestError('Invalid credentials');
    }
    const { username, password } = result.data;

    const user = await findUserByUsername(username);

    if (!user) {
        throw new NotFoundError('User not found');
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
        throw new AuthError('Invalid password');
    }

    const userID = user._id.toString();
    setNewToken(res, userID, 'refresh');
    setNewToken(res, userID, 'access');

    logger.info('Login successful');
    sendSuccess(res, 201, 'Log in success', user);
}

export async function register(req: Request, res: Response) {
    logger.info('New user is being registered')
    const credentials = req.body;
    const result = registerCredentialsSchema.safeParse(credentials);
    if (result.error) {
        logger.error(result.error);
        throw new BadRequestError('Invalid credentials');
    }
    const { username, email, password } = result.data;

    if (await isUsernameTaken(username)) {
        throw new ConflictError('Username is already in use');
    }

    if (await isEmailTaken(email)) {
        throw new ConflictError('Email is already registered');
    }

    const hashedPassword = await hashPassword(password);

    if (!hashedPassword) {
        throw new InternalServerError('Password encryption failed');
    }

    const user = await createNewUser({
        username,
        email,
        password: hashedPassword,
    });

    logger.info(`New user has been created: [username: ${user.username}; _id: ${user._id}]`);
    sendSuccess(res, 201, 'Successfuly created user', user);
}

export async function guestLogin(req: Request, res: Response) {
    res.json({
        user: {
            id: 420,
            username: 'guest',
        },
    });
}

export async function logout(req: Request, res: Response) {
    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    logger.info(`User has been logged out`);
    sendSuccess(res, 201, 'User logged out');
}

export async function authorizeUser(req: AuthenticatedRequest, res: Response) {
    logger.info(`user ${req.user_id} authorized`);
    sendSuccess(res, 201, 'User authorized');
}
