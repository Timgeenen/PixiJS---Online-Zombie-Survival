import logger from '@Utils/logger';
import { Server as HttpServer } from 'http';
import { Server, Socket, type ServerOptions } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import { createJoinSocketRoom } from './socketEvents';

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
        this.io.use(authMiddleware);
    }

    public init() {
        this.io.on('connection', (socket) => {
            logger.info('connected to main socket');
            this.initEvents(socket);
        });
    }

    public initEvents(socket: Socket) {
        socket.on('join_room', createJoinSocketRoom(socket));
    }
}
