import type SocketIoInstance from '@Library/socket';
import { type ServerTickData } from '@monorepo/shared';
import { useSocketStore } from '@Store';
import type ClientGame from '../classes/ClientGame';

export function registerGameSocket(game: ClientGame) {
    const { socket } = useSocketStore.getState();
    if (!socket) {
        return console.error('Could not register game listeners: socket not found');
    }
    socket.on('game_update', (packet) => game.addServerPacket(packet));
    socket.on('game_start', (data) => startGame(data, game, socket));
}

export function unregisterGameSocket() {
    const { socket } = useSocketStore.getState();
    if (!socket) {
        return console.error('Could not unregister game listeners: socket not found');
    }
    socket.off('game_update');
    socket.off('game_start');
}

export function setPingInterval(socket: SocketIoInstance, game: ClientGame) {
    setInterval(() => {
        const prev = performance.now();
        socket.emit('ping', (response) => {
            game.rtt = performance.now() - prev;
            if (response.success) {
                game.setTickData(response.data);
            }
        });
    }, 1000);
}

function startGame(gameData: ServerTickData, game: ClientGame, socket: SocketIoInstance) {
    game.startGame(gameData);
    setPingInterval(socket, game);
    function gameLoop(): void {
        const serverTick = game.predictServerTick();
        const idealClientTick = serverTick - game.tickOffset - game.interpolationDelay;
        if (game.currentTick < idealClientTick) {
            const data = game.update(game.tickDt);
            if (data && data.snapshots.length > 0) {
                socket.emit('game_update', { snapshots: data.snapshots });
            }
        }
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}
