import type { ApiResponse } from '@monorepo/shared';
import logger from '@Utils/logger';
import { AppError } from 'errors/customErrors';
import type { Response, Request, NextFunction } from 'express';

export function errorHandler<T>(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
): Response<ApiResponse<T>> {
    logger.error(err);
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
