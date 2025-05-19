import { sendSuccess } from '@Utils/apiResponse';
import { comparePassword, hashPassword } from '@Utils/hash';
import { setNewToken } from '@Utils/jwt';
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
    const { username, password } = req.body;

    if (!username || !password) {
        throw new BadRequestError(
            `Missing credentials: ${!username && 'username, '}${!password && 'password'}`,
        );
    }

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

    sendSuccess(res, 201, 'Log in success', user);
}

export async function register(req: Request, res: Response) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        throw new BadRequestError(
            `Missing credentials: ${!username && 'username, '} ${!email && 'email, '} ${!password && 'password'}`,
        );
    }

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

export async function authorizeUser(req: Request, res: Response) {
    sendSuccess(res, 201, 'User authorized');
}
