export class AppError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'AppError';
        this.status = status;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class BadRequestError extends AppError {
    constructor(message = 'Bad Request') {
        super(message, 400);
    }
}

export class AuthError extends AppError {
    constructor(message = 'Unauthorized Access') {
        super(message, 401);
    }
}

export class NotFoundError extends AppError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = 'Conflict Error') {
        super(message, 409);
    }
}

export class InternalServerError extends AppError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}
