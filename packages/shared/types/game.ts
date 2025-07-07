import { z } from 'zod';
import type { gameDifficultiesSchema, gameModesSchema } from '../schemas';

export type GameDifficulties = z.infer<typeof gameDifficultiesSchema>;
export type GameModes = z.infer<typeof gameModesSchema>;

// export interface Position {
//     x: number,
//     y: number
// }

// export interface WeaponInfo {
//     readonly clipSize: number,
//     readonly reloadSpeed: number,
//     readonly range: number
//     ammo: number,
//     clips: number,
// }

// export interface PlayerState {
//     readonly _id: string,
//     readonly username: string,
//     position: Position,
//     direction: number,
//     hp: number,
//     speed: number,
//     currentWeaponIndex: number,
//     weapons: WeaponInfo[]
// }

// export interface InitialGameData {
//     settings: LobbySettings,
//     players: Record<string, PlayerState>
// }
