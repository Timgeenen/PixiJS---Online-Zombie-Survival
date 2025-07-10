import type { Game } from '../core';
import SpawnSystem from './SpawnSystem';
import System from './System';

export default class GameSystems<G extends Game> {
    constructor(game: G) {}
}
