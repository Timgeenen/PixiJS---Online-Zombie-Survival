import { ComponentSchemas, Game, TICK, type ClientData, type ComponentData, type Entity, type GameState, type ServerTickData } from '@monorepo/shared';
import type { Application } from 'pixi.js';
import ClientGameSystems from './ClientGameSystems';
import InputManager from './inputManager';
import type { ComponentType } from 'react';

export default class ClientGame extends Game {
    public readonly player_entity: Entity;
    public readonly player_id: string;
    public readonly systems: ClientGameSystems;
    private clientData: ClientData = { snapshots: [] };
    private entityId = 9000000;
    public lastServerTick = 0;
    public tickOffset = 0;
    public tickZeroMs = 0;
    public rtt = 0;

    public justRotatedMap: Map<Entity, {}> = new Map();


    constructor(data: GameState, inputManager: InputManager, app: Application, player_id: string) {
        super(data);
        this.player_id = player_id;
        this.player_entity = this.getPlayerEntity(player_id);
        this.systems = new ClientGameSystems(this, inputManager, app);
        for (const [e, _] of this.playerMap) {
            this.queues.justSpawned.push({ entity: e});
        }
    }

    // public gameLoop(currentTime: number): void {
    //     const serverTick = this.predictServerTick();
    //     const idealClientTick = serverTick - this.tickOffset;
    //     while (this.currentTick < idealClientTick) {
    //         this.update(TICK)
    //     }
    //     requestAnimationFrame(this.gameLoop);
    // }

    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    public updateClient(data: GameState): void {
        const position = data.Position;
        if (position) {
            console.log('LOCAL', this.positionMap.get(this.player_entity))
            console.log('SERVER', position[this.player_entity])
        }
    }

    public startGameLoop(data: ServerTickData): void {
        const nowClient = performance.now();
        const timeDiff = Date.now() - data.serverTimeMs;
        this.tickZeroMs = nowClient - timeDiff;
    }

    public setTickData(data: ServerTickData): void {
        this.lastServerTick = data.tick
        this.tickOffset = this.currentTick - data.tick
    }

    public predictServerTick(): number {
        return Math.floor((performance.now() - this.tickZeroMs) / this.tickDt);
    }

    public update(dt: number): ClientData {
        this.currentTick++
        this.systems.inputSystem.update(dt);
        this.systems.weaponSwitchSystem.update(dt)
        this.systems.reloadSystemA.update(dt);
        this.systems.fireControlSystem.update(dt);
        this.systems.ammoSystem.update(dt);
        this.systems.reloadSystemB.update(dt);
        this.systems.movementPredictSystem.update(dt)
        this.systems.movementCommitSystem.update(dt);
        this.systems.spawnSystem.update(dt);
        this.systems.renderSystem.update(dt);
        return this.clientData;
    }
}
