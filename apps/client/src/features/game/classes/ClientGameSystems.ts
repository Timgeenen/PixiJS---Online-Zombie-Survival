import { AmmoSystem, FireControlSystem, GameSystems, MovementCommitSystem, MovementPredictSystem, ReloadSystemA, ReloadSystemB, SpawnSystem, WeaponSwitchSystem } from '@monorepo/shared/systems';
import type { Application } from 'pixi.js';
import type ClientGame from './ClientGame';
import ClientInputSystem from './ClientInputSystem';
import InputManager from './inputManager';
import RenderSystem from './RenderSystem';

export default class ClientGameSystems extends GameSystems<ClientGame> {
    inputSystem: ClientInputSystem;
    weaponSwitchSystem: WeaponSwitchSystem<ClientGame>;
    reloadSystemA: ReloadSystemA<ClientGame>;
    reloadSystemB: ReloadSystemB<ClientGame>;
    ammoSystem: AmmoSystem<ClientGame>;
    movementPredictSystem: MovementPredictSystem<ClientGame>;
    movementCommitSystem: MovementCommitSystem<ClientGame>;
    spawnSystem: SpawnSystem<ClientGame>;
    renderSystem: RenderSystem;
    fireControlSystem: FireControlSystem<ClientGame>;

    constructor(game: ClientGame, inputManager: InputManager, app: Application) {
        super(game);
        this.inputSystem = new ClientInputSystem(game, inputManager);
        this.weaponSwitchSystem = new WeaponSwitchSystem(game);
        this.reloadSystemA = new ReloadSystemA(game);
        this.fireControlSystem = new FireControlSystem(game);
        this.ammoSystem = new AmmoSystem(game);
        this.reloadSystemB = new ReloadSystemB(game);
        this.movementPredictSystem = new MovementPredictSystem(game);
        this.movementCommitSystem = new MovementCommitSystem(game);
        this.spawnSystem = new SpawnSystem(game);
        this.renderSystem = new RenderSystem(game, app)
    }
}
