import type { ApiResponse } from '@monorepo/shared';
import { AppError } from 'errors/customErrors';
import type { Response } from 'express';

export function errorHandler<T>(err: any, res: Response): Response<ApiResponse<T>> {
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
