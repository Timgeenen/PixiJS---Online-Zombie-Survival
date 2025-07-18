import type {
    ComponentData,
    GameState,
    PublicLobbyProfile,
    ServerPacket,
    ServerTickData,
} from '@monorepo/shared';
import logger from '@Utils/logger';
import type { ServerLobby } from './classes/Lobby';
import { ServerGame } from './classes/ServerGame';
import type { GameMap } from './gameMap';
import { createPlayer } from '@monorepo/shared/factories/player';
import createWeapon from '@monorepo/shared/factories/weapon';

export function createGameInstance(
    lobby: ServerLobby,
    gameMap: GameMap,
    data?: Partial<GameState>,
): void {
    logger.info('creating game instance');
    const GameInstance = new ServerGame({ ...data });
    logger.info('spawning players');
    let x = 200;
    for (const [_, value] of lobby.players) {
        const e = createPlayer(GameInstance, {
            type: 'player',
            position: { y: 300, x },
            profile: value,
        });
        createWeapon(GameInstance, {
            type: 'pistol',
            owner: e,
        });
        x += 100;
    }
    gameMap.set(lobby._id, GameInstance);
}

export function startGameLoop(
    game: ServerGame,
    sendClientUpdate: (packet: ServerPacket) => void,
): void {
    let previous = performance.now();
    let accumulator = 0;
    function gameLoop(): void {
        if (game.gameEnd) {
            logger.info('Game ended');
            return;
        }
        const now = performance.now();
        const delta = now - previous;
        accumulator += delta;
        previous = now;
        while (accumulator >= game.tickDt) {
            game.update(game.tickDt);
            if (game.currentTick % 3 === 0) {
                const packet = game.createPacket();
                if (packet) {
                    sendClientUpdate(packet);
                }
            }
            accumulator -= game.tickDt;
        }
        setTimeout(() => {
            gameLoop();
        }, game.tickDt - accumulator);
    }
    gameLoop();
}

// export function createNewPlayer(
//     player_id: string,
//     player: PublicLobbyProfile,
//     position: ComponentData<'Position'>,
//     Game: ServerGame,
// ) {
//     const entity = Game.systems.spawnSystem.spawnPlayer('player', position);
//     Game.playerEntityMap.set(player_id, entity);
//     Game.playerMap.set(entity, { ...player, isReady: false });
// }
