import {
    Game,
    type ClientData,
    type Entity,
    type GameState,
    type ServerPacket,
    type ServerTickData
} from '@monorepo/shared';
import type { Application } from 'pixi.js';
import ClientGameSystems from './ClientGameSystems';
import InputManager from './inputManager';

export default class ClientGame extends Game {
    public readonly player_entity: Entity;
    public readonly player_id: string;
    public readonly systems: ClientGameSystems;
    public packetBuffer: Array<ServerPacket> = [];
    public clientData: ClientData = { snapshots: [] };
    private entityId = 9000000;
    public lastServerTick = 0;
    public tickOffset = 0;
    public tickZeroMs = 0;
    public rtt = 0;
    public interpolationDelay = 2;

    public justRotatedMap: Map<Entity, {}> = new Map();

    constructor(data: GameState, inputManager: InputManager, app: Application, player_id: string) {
        super(data);
        this.player_id = player_id;
        this.player_entity = this.getPlayerEntity(player_id);
        this.systems = new ClientGameSystems(this, inputManager, app);
        for (const [e, _] of this.playerMap) {
            this.queues.justSpawned.push({ entity: e });
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

    // override updateComponent<K extends ComponentType>(e: Entity, component: K, value: ComponentData<K>): void {
    // }

    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    public addServerPacket(packet: ServerPacket): void {
        if (packet.tick < this.currentTick - this.bufferSize) {
            console.error('packet expired');
            return;
        }
        const buffer = this.packetBuffer;
        let low = 0;
        let high = buffer.length;
        while (low < high) {
            const mid = (low + high) >> 1;
            if (buffer[mid]!.tick < packet.tick) {
                low = mid + 1;
            } else {
                high = mid;
            }
        }
        buffer.splice(low, 0, packet);
        const filtered = this.filterBuffer(buffer, this.currentTick);
        this.packetBuffer = filtered as ServerPacket[];
    }

    public startGame(data: ServerTickData): void {
        const nowClient = performance.now();
        const timeDiff = Date.now() - data.serverTimeMs;
        this.tickZeroMs = nowClient - timeDiff;
    }

    public setTickData(data: ServerTickData): void {
        this.lastServerTick = data.tick;
        this.tickOffset = this.currentTick - data.tick;
        this.interpolationDelay = Math.max(4, Math.floor(this.tickOffset / 2));
    }

    public predictServerTick(): number {
        return Math.floor((performance.now() - this.tickZeroMs) / this.tickDt);
    }

    public update(dt: number): ClientData {
        this.currentTick++;
        this.systems.networkSyncSystem.update(dt);
        this.systems.inputSystem.update(dt);
        this.systems.weaponSwitchSystem.update(dt);
        this.systems.reloadSystemA.update(dt);
        this.systems.fireControlSystem.update(dt);
        this.systems.ammoSystem.update(dt);
        this.systems.reloadSystemB.update(dt);
        this.systems.movementPredictSystem.update(dt);
        this.systems.movementCommitSystem.update(dt);
        this.systems.spawnSystem.update(dt);
        this.systems.renderSystem.update(dt);
        return this.clientData;
    }
}
