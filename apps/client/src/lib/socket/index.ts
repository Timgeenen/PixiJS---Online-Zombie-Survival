import { io, Socket } from 'socket.io-client';
import type { EmitEvents, ListenerEvents, SocketInstance } from './types';
import { authorizeUser } from '@Services';
import type { SocketResponseBase } from '@monorepo/shared';

export default class SocketIoInstance implements SocketInstance {
    private socket: Socket | null = null;
    private readonly url =
        import.meta.env.VITE_ENV === 'dev'
            ? import.meta.env.VITE_LOCALHOST
            : import.meta.env.VITE_BACKEND;

    constructor() {}

    async initialize() {
        if (this.socket) {
            return console.error('Socket is already connected');
        }

        this.socket = io(this.url, {
            withCredentials: true,
            autoConnect: false,
        });
        this.registerDefaultListeners();
        this.socket.connect();
    }

    disconnect() {
        this.socket?.disconnect();
    }

    on<K extends keyof ListenerEvents>(event: K, callback: ListenerEvents[K]) {
        this.socket?.on(event as string, callback);
    }

    emit<K extends keyof EmitEvents>(event: K, ...args: Parameters<EmitEvents[K]>) {
        this.socket?.emit(event, ...args);
    }

    get connected(): boolean {
        return this.socket?.connected ?? false;
    }

    private registerDefaultListeners() {
        if (!this.socket) {
            return;
        }

        this.socket.on('connect', () => {
            console.log(`connected to socket`);
        });
        this.socket.on('disconnect', () => {
            console.log('socket disconnected');
        });
        this.socket.on('connect_error', async (err) => {
            if (err.message === 'TOKEN_EXPIRED') {
                const refresh = await authorizeUser();
                if (!refresh.success) {
                    return console.error('Could not refresh token');
                }
                if (this.socket?.disconnected) {
                    this.socket?.connect();
                }
            }
        });
    }
}
