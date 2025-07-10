import type { SocketErrorResponse } from '@monorepo/shared';

interface ErrorOptions {
    callback: (response: SocketErrorResponse) => void;
    clientMessage?: string;
}

export class SocketError extends Error {
    status: number;
    clientMessage: string;
    callback?: (response: SocketErrorResponse) => void;

    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage);
        this.name = 'SocketError';
        this.status = 500;
        this.message = logErrorMessage;
        this.clientMessage = options?.clientMessage ?? 'Something went wrong';
        this.callback = options?.callback;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class SocketBadRequestError extends SocketError {
    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage, options);
        this.status = 404;
        this.clientMessage = options?.clientMessage ?? '400: Bad Request error';
        this.callback = options?.callback;
    }
}

export class SocketAuthError extends SocketError {
    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage, options);
        this.status = 401;
        this.clientMessage = options?.clientMessage ?? '401: Authorization error';
        this.callback = options?.callback;
    }
}

export class SocketForbiddenError extends SocketError {
    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage, options);
        this.status = 403;
        this.clientMessage = options?.clientMessage ?? '403: Forbidden access';
        this.callback = options?.callback;
    }
}

export class SocketNotFoundError extends SocketError {
    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage, options);
        this.status = 404;
        this.clientMessage = options?.clientMessage ?? '404: Not found';
        this.callback = options?.callback;
    }
}

export class SocketConflictError extends SocketError {
    constructor(logErrorMessage: string, options?: ErrorOptions) {
        super(logErrorMessage, options);
        this.status = 409;
        this.clientMessage = options?.clientMessage ?? '409: Conflict error';
        this.callback = options?.callback;
    }
}
