import type { Request, Response } from 'express';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const users = [
    {
        id: 1,
        username: 'user1',
        password: 'vHVnhCyY2I/bpkwOgoXfBqvUbNU=',
    },
];

exports.login = (req: Request, res: Response) => {
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

exports.register = (req: Request, res: Response) => {}; //TODO

exports.guestLogin = (req: Request, res: Response) => {
    res.json({ user: {
        id: 420,
        username: "guest",
    }})
}

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
