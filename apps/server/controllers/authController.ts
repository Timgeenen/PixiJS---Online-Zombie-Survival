import { hashPassword } from '@Utils/hash';
import { BadRequestError, ConflictError, InternalServerError } from 'errors/customErrors';
import type { Request, Response } from 'express';
import { createNewUser, isEmailTaken, isUsernameTaken } from 'services/userService';

const jwt = require('jsonwebtoken');

const users = [
    {
        id: 1,
        username: 'user1',
        password: 'vHVnhCyY2I/bpkwOgoXfBqvUbNU=',
    },
];

exports.login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(401).json({
            error: 'Invalid credentials',
        });
    }

    res.json({ user: user });
    //TODO: add encryption
    //TODO: add to database
    // bcrypt.compare(password, user.password, (err: Error | undefined, isMatch: boolean) => {
    //     if (isMatch) {
    //         const token = jwt.sign(
    //             { id: user.id, username: user.username },
    //             process.env.JWT_SECRET,
    //             {
    //                 expiresIn: '20min',
    //             },
    //         );
    //         res.json({ token });
    //     } else {
    //         res.status(401).json({ error: 'Invalid credentials' });
    //     }
    // });
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

        res.status(201).json({
            success: true,
            data: user,
        });
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

exports.validateToken = (req: Request, res: Response) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({ error: 'No token provided' });
    }
    try {
        const decoded = jwt.validateToken(token, process.env.JWT_SECRET);
        res.json({ user: { id: decoded.id, username: decoded.username } });
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
