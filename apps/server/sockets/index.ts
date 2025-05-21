import { Server as HttpServer } from 'http';
import { Server, type ServerOptions } from 'socket.io';

const socketOptions = {
    cors: {
        origin: "*",
        credentials: true
    },
} as ServerOptions;

export class SocketInstance {
    private io: Server

    constructor(httpServer: HttpServer) {
        this.io = new Server(httpServer, socketOptions)
    }
    
    public init() {
        this.io.on('connection', () => {
            console.log("Connected")
        })
    }
}