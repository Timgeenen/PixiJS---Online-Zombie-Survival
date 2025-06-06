import logger from '@Utils/logger';
import { Server as HttpServer } from 'http';
import { Server, Socket, type ServerOptions } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import { createJoinSocketLobby, createLeaveSocketLobby } from './socketEvents';
import errorCatcher from './errorCatcher';

const socketOptions = {
    cors: {
        origin: '*',
        credentials: true,
    },
} as ServerOptions;

export class SocketInstance {
    private io: Server;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, socketOptions);
        this.io.use(errorCatcher(authMiddleware));
    }

    public init() {
        this.io.on('connection', (socket) => {
            socket.join(socket.data.user_id);
            logger.info('connected to main socket');
            this.initEvents(socket);
            socket.on('disconnect', (reason) => {
                logger.info(reason);
            });
        });
    }

    public initEvents(socket: Socket) {
        socket.on('join_lobby', errorCatcher(createJoinSocketLobby(socket)));
        socket.on('leave_lobby', errorCatcher(createLeaveSocketLobby(socket)));
    }
}
