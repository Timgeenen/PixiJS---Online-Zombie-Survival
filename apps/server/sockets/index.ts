import logger from '@Utils/logger';
import { Server as HttpServer } from 'http';
import { Server, Socket, type ServerOptions } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import errorCatcher from './errorCatcher';
import LobbyMap from './lobbyMap';
import {
    createCreateNewSocketLobby,
    createJoinSocketLobby,
    createLeaveSocketLobby,
    createSetPlayerReady,
} from './socketEvents';

const socketOptions = {
    cors: {
        origin: '*',
        credentials: true,
    },
} as ServerOptions;

export class SocketInstance {
    private io: Server;
    lobbies: LobbyMap;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, socketOptions);
        this.io.use(errorCatcher(authMiddleware));
        this.lobbies = new LobbyMap();
    }

    public init() {
        this.io.on('connection', (socket) => {
            socket.join(socket.data.user_id);
            logger.info('connected to main socket');
            this.initListenerEvents(socket, this.lobbies);
            socket.on('disconnect', (reason) => {
                logger.info(`Socket disconnected: ${reason}`);
                this.handleCleanup(socket);
            });
        });
    }

    private initListenerEvents(socket: Socket, lobbies: LobbyMap) {
        socket.on('create_new_lobby', errorCatcher(createCreateNewSocketLobby(socket, lobbies)));
        socket.on('join_lobby', errorCatcher(createJoinSocketLobby(socket, lobbies)));
        socket.on('leave_lobby', errorCatcher(createLeaveSocketLobby(socket, lobbies)));
        socket.on('player_ready', errorCatcher(createSetPlayerReady(socket, lobbies)));
    }

    private handleCleanup(socket: Socket) {
        const { user_id, lobby_id } = socket.data;
        if (user_id) {
            return;
        }
        if (lobby_id) {
            const lobby = this.lobbies.get(lobby_id);
            if (lobby) {
                lobby.removePlayer(user_id);
                socket.to(lobby_id).emit('remove_player', user_id);
                if (lobby.isEmptyLobby()) {
                    this.lobbies.deleteLobby(lobby_id);
                }
            }
        }
    }
}
