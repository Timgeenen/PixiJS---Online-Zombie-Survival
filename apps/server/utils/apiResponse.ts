import type { ApiResponse } from '@monorepo/shared';
import type { Response } from 'express';

export function sendSuccess<T>(
    res: Response,
    status = 200,
    message = 'Request Successful',
    data?: T,
): Response<ApiResponse<T>> {
    return res.status(status).json({
        success: true,
        message,
        data,
    });
}
