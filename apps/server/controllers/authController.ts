import { hashPassword } from '@Utils/hash';
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
            return res.status(400).json({
                msg: `Missing credentials: ${!username && 'username, '} ${!email && 'email, '} ${!password && 'password'}`,
            });
        }

        if (await isUsernameTaken(username)) {
            return res.status(409).json({
                msg: 'Username is already in use',
            });
        }

        if (await isEmailTaken(email)) {
            return res.status(409).json({
                msg: 'Email is already registered',
            });
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            return res.status(500).json({
                msg: 'Password encryption failed',
            });
        }

        const user = await createNewUser({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            msg: 'User registered',
            user,
        });
    } catch (error) {
        console.error('Error in authController: ', error);
        res.status(500).json({ msg: 'Server error during registration' });
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
