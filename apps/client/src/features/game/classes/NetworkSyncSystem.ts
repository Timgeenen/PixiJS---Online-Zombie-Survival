import { System } from '@monorepo/shared';
import { useSocketStore } from '@Store';
import type ClientGame from './ClientGame';

export default class NetworkSyncSystem extends System {
    constructor(protected game: ClientGame) {
        super()
    }

    override update(dt: number): void {
        
    }
}
