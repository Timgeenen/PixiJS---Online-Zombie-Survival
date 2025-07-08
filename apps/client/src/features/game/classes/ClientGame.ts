import { Game, type Entity, type GameState } from '@monorepo/shared';
import type { Application } from 'pixi.js';
import ClientGameSystems from './ClientGameSystems';
import InputManager from './inputManager';

export default class ClientGame extends Game {
    private entityId = 9000000;
    justRotatedMap: Map<Entity, {}>;

    public readonly player_entity: Entity;
    public readonly player_id: string;
    public readonly systems: ClientGameSystems;

    constructor(data: GameState, inputManager: InputManager, app: Application, player_id: string) {
        super(data);
        this.player_id = player_id;
        this.player_entity = this.getPlayerEntity(player_id);
        this.systems = new ClientGameSystems(this, inputManager, app);
        this.justRotatedMap = new Map();
        for (const [e, _] of this.playerMap) {
            this.queues.justSpawned.push({ entity: e});
        }
    }

    getPlayerEntity(player_id: string): Entity {
        let entity: Entity | null = null;
        for (const [e, player] of this.playerMap) {
            if (player._id === player_id) {
                return entity = e;
            }
        }
        if (!entity) {
            throw new Error('Could not find player_id in entity map');
        }
        return entity
    }

    override createEntity(): Entity {
        const entity = this.entityId++;
        this.createComponent(entity, 'CreatedAt', { tick: this.currentTick });
        return entity;
    }

    public update(dt: number) {
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
    }
}
