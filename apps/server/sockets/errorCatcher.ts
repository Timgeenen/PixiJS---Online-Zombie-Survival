import logger from '@Utils/logger';
import { SocketError } from 'errors/customSocketErrors';

export default function errorCatcher(event: (...args: any[]) => any) {
    return (...args: any[]) => {
        try {
            const result = event(...args);
            if (result instanceof Promise) {
                result.catch((error) => {
                    if (error instanceof SocketError) {
                        handleSocketError(error);
                    }
                    handleStandardError(error);
                });
            }
        } catch (error: any) {
            if (error instanceof SocketError) {
                if (error.message === 'TOKEN_EXPIRED') {
                    return logger.error('TOKEN EXPIRED ERROR CAUGHT');
                }
                handleSocketError(error);
            }
            handleStandardError(error);
        }
    };
}

function handleSocketError(error: SocketError) {
    logger.error(`[${error.status}] ${error.stack}`);
    if (error.callback) {
        error.callback({ success: false, message: error.clientMessage });
    }
    return;
}

function handleStandardError(error: Error) {
    return logger.error(error);
}
