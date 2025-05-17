import { InternalServerError } from 'errors/customErrors';
import type { Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

type TokenType = 'refresh' | 'access';
interface TokenPayload extends JwtPayload {
    user_id: string;
}

export function setNewToken(res: Response, user_id: string, tokenType: TokenType) {
    const lifetime = tokenType === 'refresh' ? '7d' : '20min';
    const maxAge = tokenType === 'refresh' ? 604800000 : 1200000;
    const SECRET =
        tokenType === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;

    if (!SECRET) {
        throw new InternalServerError(`Could not find JWT secret. type: ${tokenType}`);
    }

    const token = jwt.sign({ user_id }, SECRET, { expiresIn: lifetime });

    res.cookie(`${tokenType}Token`, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: maxAge,
        sameSite: 'strict',
    });
}

export function verifyToken(token: string, tokenType: TokenType): TokenPayload {
    const SECRET =
        tokenType === 'refresh' ? process.env.JWT_REFRESH_SECRET : process.env.JWT_SECRET;

    if (!SECRET) {
        throw new InternalServerError(`Could not find JWT secret of type: ${tokenType}`);
    }

    const decoded = jwt.verify(token, SECRET);

    if (typeof decoded === 'string') {
        throw new InternalServerError('JWT payload type of string is invalid');
    }

    return decoded as TokenPayload;
}
