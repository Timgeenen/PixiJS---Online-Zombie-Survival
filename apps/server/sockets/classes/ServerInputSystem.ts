import { InputSystem } from '@monorepo/shared';
import type { ServerGame } from './ServerGame';

export default class ServerInputSystem extends InputSystem<ServerGame> {
    constructor(game: ServerGame) {
        super(game);
    }

    override update(dt: number) {
        //set snapshot queue based on received snapshots
        //run root update to process snapshots
    }

    private updateSnapshotQueue() {}
}
