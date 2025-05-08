import { sendSuccess } from '@Utils/apiResponse';
import { comparePassword, hashPassword } from '@Utils/hash';
import { AuthError, BadRequestError, ConflictError, InternalServerError, NotFoundError } from 'errors/customErrors';
import type { Request, Response } from 'express';
import { createNewUser, findUserByUsername, isEmailTaken, isUsernameTaken } from 'services/userService';

const jwt = require('jsonwebtoken');

exports.login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
    
        if (!username || !password) {
            throw new BadRequestError(`Missing credentials: ${!username && "username, "}${!password && "password"}`);
        }

        const user = await findUserByUsername(username);
    
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const match = await comparePassword(password, user.password);

        if (!match) {
            throw new AuthError('Invalid password');
        }

        sendSuccess(res, user, 201, "Log in success");
    } catch (error) {
        throw new InternalServerError('Error occurred while trying to log in')
    }
};

exports.register = async (req: Request, res: Response) => {
    try {
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

        sendSuccess(res, user, 201, "Successfuly created user");
    } catch (error) {
        throw new InternalServerError('Error in authController.register');
    }
};

exports.guestLogin = (req: Request, res: Response) => {
    res.json({
        user: {
            id: 420,
            username: 'guest',
        },
    });
};

// exports.validateToken = (req: Request, res: Response) => {
//     const token = req.header('Authorization')?.replace('Bearer ', '');
//     if (!token) {
//         res.status(401).json({ error: 'No token provided' });
//     }
//     try {
//         const decoded = jwt.validateToken(token, process.env.JWT_SECRET);
//         res.json({ user: { id: decoded.id, username: decoded.username } });
//     } catch (err) {
//         res.status(401).json({ error: 'Invalid token' });
//     }
// };
