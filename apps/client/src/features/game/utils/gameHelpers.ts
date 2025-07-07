import type { Keybindings } from '@monorepo/shared';
import { Assets, Sprite, Spritesheet, Texture } from 'pixi.js';

// interface Animations {
//   [key: string]: Array<string>
// };

// interface Props {
//   width: number,
//   height: number,
//   columns: number,
//   gapX: number,
//   gapY: number,
//   offsetX: number,
//   offsetY: number,
//   total: number,
//   scale: number,
//   name: string,
//   image: string,
//   sheetWidth: number,
//   sheetHeight: number,
//   animations: Animations
// };

// interface Frame {
//   x: number,
//   y: number,
//   w: number,
//   h: number
// }
// interface SpriteData {
//   frame: Frame,
//   sourceSize: Frame,
//   spriteSourceSize: Frame
// }
// interface SpriteSheet {
//   [key: string]: SpriteData
// }

export function getAssetUrl(img_name: string): string {
    return new URL(`../../../assets/game/${img_name}`, import.meta.url).href;
}

export function getSprite(name: string): Sprite {
    return new Sprite(Assets.get(name));
}

// interface MapParams {
//   tiles: number[],
//   columns: number,
//   rows: number
// };

// interface ObjectParams {
//   frequency: number,
//   tiles: number[],
//   columns: number,
//   rows: number
// }

// export const getSpriteSheet = async ({
//   width,
//   height,
//   columns,
//   gapX,
//   gapY,
//   offsetX,
//   offsetY,
//   total,
//   scale,
//   name,
//   image,
//   sheetWidth,
//   sheetHeight,
//   animations
// }: Props) => {
//     try {

//         const frames: SpriteSheet = {};

//         for (let i = 0; i < total; i++) {
//           const colMod = i % columns;
//           const row = Math.floor(i / columns);

//           const frame: Frame = {
//             x: colMod * width + colMod * gapX + offsetX,
//             y: row * height + row * gapY + offsetY,
//             w: width,
//             h: height
//           }

//           const spriteSourceFrame = {
//             x: 0,
//             y: 0,
//             w: width,
//             h: height
//           }

//           frames[name + (i + 1).toString()] = {
//             frame: frame,
//             sourceSize: frame,
//             spriteSourceSize: spriteSourceFrame
//           }
//         }

//         const atlasData = {
//           frames: frames,
//           meta: {
//             image: image,
//             format: 'RGBA8888',
//             size: {
//               w: sheetWidth,
//               h: sheetHeight
//             },
//             scale: scale,
//           },
//           animations: animations
//         }
//         const texture = await Assets.load(getAssetUrl(atlasData.meta.image))
//         console.log(atlasData)
//         const spritesheet = new Spritesheet(texture, atlasData);
//         spritesheet.parse();

//         return spritesheet;
//     } catch (error) {
//         console.error(error)
//     }
// }

// // export const getFrames = (
// //   spritesheet: Spritesheet,
// // ) => {

// //   interface Frames {
// //     [key: string]: Texture<Resource>[]
// //   }
// //   const frames: Frames = {};

// //   for (const key in spritesheet.animations) {
// //     const frame = spritesheet.animations[key].map(frame => {
// //       const index = frame.textureCacheIds[0];
// //       return spritesheet.textures[index];
// //     });

// //     frames[key] = frame;
// //   }

// //   return frames;
// // }

// // export const getMapData = ({
// //   tiles,
// //   columns,
// //   rows
// // }: MapParams) => {
// //   const mapData: number[] [] = [];
// //   const part = 1 / tiles.length;

// //   for (let i = 0; i < rows; i++) {
// //     mapData.push([]);
// //     for (let j = 0; j < columns; j++) {
// //       const index = Math.floor(Math.random() / part);
// //       mapData[i].push(tiles[index])
// //     }
// //   }

// //   return mapData;
// // }

// // export const getObjectData = ({
// //   frequency,
// //   tiles,
// //   columns,
// //   rows
// // }: ObjectParams) => {
// //   const objectData: (number | null)[] [] = [];
// //   const part = 1 / tiles.length;

// //   for (let i = 0; i < rows; i++) {
// //     objectData.push([]);

// //     for (let j = 0; j < columns; j++) {
// //       if (Math.random() < frequency) {
// //         const index = Math.floor(Math.random() / part);
// //         objectData[i].push(tiles[index]);
// //       } else {
// //         objectData[i].push(null);
// //       }
// //     }
// //   }

// //   return objectData;
// // }

// // export const checkBoundingBoxCollision = (obj1, obj2) => {
// //   if (
// //     obj1.x > obj2.x + obj2.width ||
// //     obj2.x > obj1.x + obj1.width ||
// //     obj1.y > obj2.y + obj2.height ||
// //     obj2.y > obj1.y + obj1.height
// //   ) { return false }

// //   return true;
// // }
