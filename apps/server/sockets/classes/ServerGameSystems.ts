import { AmmoSystem, FireControlSystem, GameSystems, InputSystem, MovementCommitSystem, MovementPredictSystem, ReloadSystemA, ReloadSystemB, SpawnSystem, WeaponSwitchSystem } from '@monorepo/shared/systems';
import type { ServerGame } from './ServerGame';

export class ServerGameSystems extends GameSystems<ServerGame> {
    inputSystem: InputSystem<ServerGame>;
    weaponSwitchSystem: WeaponSwitchSystem<ServerGame>;
    reloadSystemA: ReloadSystemA<ServerGame>;
    reloadSystemB: ReloadSystemB<ServerGame>;
    ammoSystem: AmmoSystem<ServerGame>;
    movementPredictSystem: MovementPredictSystem<ServerGame>;
    movementCommitSystem: MovementCommitSystem<ServerGame>;
    spawnSystem: SpawnSystem<ServerGame>;
    fireControlSystem: FireControlSystem<ServerGame>;

    constructor(game: ServerGame) {
        super(game);
        this.inputSystem = new InputSystem(game);
        this.weaponSwitchSystem = new WeaponSwitchSystem(game);
        this.reloadSystemA = new ReloadSystemA(game);
        this.fireControlSystem = new FireControlSystem(game);
        this.ammoSystem = new AmmoSystem(game);
        this.reloadSystemB = new ReloadSystemB(game);
        this.movementPredictSystem = new MovementPredictSystem(game);
        this.movementCommitSystem = new MovementCommitSystem(game);
        this.spawnSystem = new SpawnSystem(game);
    }
}
