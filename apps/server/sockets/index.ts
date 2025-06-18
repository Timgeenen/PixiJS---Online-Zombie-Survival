import logger from '@Utils/logger';
import { Server as HttpServer } from 'http';
import { Server, Socket, type ServerOptions } from 'socket.io';
import { authMiddleware } from './authMiddleware';
import errorCatcher from './errorCatcher';
import LobbyMap from './lobbyMap';
import {
    createCreateNewSocketLobby,
    createJoinSocketLobby,
    createJoinSocketLobbyList,
    createLeaveSocketLobby,
    createLeaveSocketLobbyList,
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
    lobbyMap: LobbyMap;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, socketOptions);
        this.io.use(errorCatcher(authMiddleware));
        this.lobbyMap = new LobbyMap();
    }

    public init() {
        this.io.on('connection', (socket) => {
            socket.join(socket.data.user_id);
            logger.info('connected to main socket');
            this.initListenerEvents(socket, this.lobbyMap);
            socket.on('disconnect', (reason) => {
                logger.info(`Socket disconnected: ${reason}`);
                this.handleCleanup(socket);
            });
        });
    }

    private initListenerEvents(socket: Socket, lobbyMap: LobbyMap) {
        //lobby listener events
        socket.on('create_new_lobby', errorCatcher(createCreateNewSocketLobby(socket, lobbyMap)));
        socket.on('join_lobby', errorCatcher(createJoinSocketLobby(socket, lobbyMap)));
        socket.on('leave_lobby', errorCatcher(createLeaveSocketLobby(socket, lobbyMap)));
        socket.on('player_ready', errorCatcher(createSetPlayerReady(socket, lobbyMap)));

        //lobby list listener events
        socket.on('join_lobby_list', errorCatcher(createJoinSocketLobbyList(socket, lobbyMap)));
        socket.on('leave_lobby_list', errorCatcher(createLeaveSocketLobbyList(socket)));
    }

    private handleCleanup(socket: Socket) {
        const { user_id, lobby_id } = socket.data;
        if (user_id) {
            return;
        }
        if (lobby_id) {
            const lobby = this.lobbyMap.get(lobby_id);
            if (lobby) {
                lobby.removePlayer(user_id);
                socket.to(lobby_id).emit('remove_player', user_id);
                if (lobby.isEmptyLobby()) {
                    this.lobbyMap.deleteLobby(lobby_id, socket);
                }
            }
        }
    }
}
