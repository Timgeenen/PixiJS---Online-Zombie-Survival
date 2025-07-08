import type { AmmoType } from '@monorepo/shared';
import type { AssetsBundle, AssetsManifest } from 'pixi.js';
import { getAssetUrl } from 'src/features/game/utils/gameHelpers';

// await getSpriteSheet({
//     width: 27,
//     height: 34,
//     columns: 3,
//     gapX: 19,
//     gapY: 1,
//     offsetX: 3,
//     offsetY: 2,
//     total: 12,
//     scale: 1,
//     name: "zombie",
//     image: '2ZombieSpriteSheet.png',
//     sheetWidth: 124,
//     sheetHeight: 144,
//     animations: {
//         down: ['zombie1', 'zombie2', 'zombie3'],
//         right: ['zombie4', 'zombie5', 'zombie6'],
//         up: ['zombie7', 'zombie8', 'zombie9'],
//         left: ['zombie10', 'zombie11', 'zombie12']
//     }
// })

const bullets: AssetsBundle = {
    name: 'bullets',
    assets: {
        pistol: {
            src: getAssetUrl('pistol_bullet.png'),
        },
        shotgun: {
            src: getAssetUrl('shotgun_bullet.png'),
        }
    },
};

const players: AssetsBundle = {
    name: 'players',
    assets: {
        player: {
            src: getAssetUrl('2ZombieSpriteSheet.json'),
        },
    },
};

export const manifest: AssetsManifest = {
    bundles: [bullets, players],
};
