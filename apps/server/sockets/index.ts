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
    createStartLobby,
} from './socketEvents';
import { getUserId } from './socketData';
import { SocketAuthError } from '@Errors/customSocketErrors';
import type { GameMap } from './gameMap';
import { createGameReady, createInitializeGame, createPing, createUpdateGame } from './gameEvents';

const socketOptions = {
    cors: {
        origin: [
            process.env.NODE_ENV === 'production'
                ? process.env.CLIENT_URL
                : process.env.CLIENT_LOCALHOST,
            'http://192.168.0.165:5500',
            'http://192.168.0.179:5500',
        ],
        credentials: true,
    },
} as ServerOptions;

export class SocketInstance {
    private io: Server;
    lobbyMap: LobbyMap;
    gameMap: GameMap;
    userSet: Set<string>;

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, socketOptions);
        this.io.use(errorCatcher(authMiddleware));
        this.lobbyMap = new LobbyMap();
        this.gameMap = new Map();
        this.userSet = new Set();
    }

    public init() {
        this.io.on('connection', (socket) => {
            const user_id = getUserId(socket);
            const isLoggedIn = this.userSet.has(user_id);
            if (isLoggedIn) {
                logger.error('user is already logged in: disconnecting socket');
                return socket.disconnect();
            }
            socket.join(user_id);
            this.userSet.add(user_id);
            logger.info('connected to main socket');
            this.initListenerEvents(socket);
            socket.on('disconnect', (reason) => {
                logger.info(`Socket disconnected: ${reason}`);
                errorCatcher(() => this.handleCleanup(socket))();
            });
        });
    }

    private initListenerEvents(socket: Socket) {
        //lobby listener events
        socket.on(
            'create_new_lobby',
            errorCatcher(createCreateNewSocketLobby(socket, this.lobbyMap)),
        );
        socket.on('join_lobby', errorCatcher(createJoinSocketLobby(socket, this.lobbyMap)));
        socket.on('leave_lobby', errorCatcher(createLeaveSocketLobby(socket, this.lobbyMap)));
        socket.on('player_ready', errorCatcher(createSetPlayerReady(socket, this.lobbyMap)));
        socket.on(
            'start_lobby',
            errorCatcher(createStartLobby(socket, this.io, this.lobbyMap, this.gameMap)),
        );

        //lobbyList listener eventsthis.
        socket.on(
            'join_lobby_list',
            errorCatcher(createJoinSocketLobbyList(socket, this.lobbyMap)),
        );
        socket.on('leave_lobby_list', errorCatcher(createLeaveSocketLobbyList(socket)));

        //game listener events
        socket.on('initialize_game', errorCatcher(createInitializeGame(socket, this.gameMap)));
        socket.on('game_player_ready', errorCatcher(createGameReady(socket, this.io, this.gameMap)));
        socket.on('game_update', errorCatcher(createUpdateGame(socket, this.gameMap)));
        socket.on('ping', errorCatcher(createPing(socket, this.gameMap)));
    }

    private handleCleanup(socket: Socket) {
        logger.info('Cleaning up socket');
        const { user_id, lobby_id } = socket.data;
        if (!user_id) {
            throw new SocketAuthError('Error occured while cleaning up socket: user_id not found');
        }
        this.userSet.delete(user_id);
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
