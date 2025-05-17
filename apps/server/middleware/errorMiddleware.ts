import { AppError } from 'errors/customErrors';
import type { Request, Response, NextFunction } from 'express';
import type { ApiResponse } from '@monorepo/shared';

export function errorHandler<T>(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): Response<ApiResponse<T>> {
    console.error(err.stack);
    if (err instanceof AppError) {
        return res.status(err.status).json({
            success: false,
            error: err.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Internal Server Error',
    });
}
