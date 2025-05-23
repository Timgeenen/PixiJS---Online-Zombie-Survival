import { io, Socket } from 'socket.io-client';
import type { EmitEvents, ListenerEvents, SocketInstance } from './types';

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

        this.socket = io(this.url);
        this.registerDefaultListeners();
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
        this.socket.on('connect_error', (err) => {
            console.error('Socket error', err);
        });
    }
}
