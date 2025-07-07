// export class SparseTileHash {
//     private solids = new Set<number>();

//     private key(tx: number, ty: number) {
//       return (tx << 16) ^ (ty & 0xffff);   // works up to ±32767 tiles
//     }

//     addSolid(tx: number, ty: number) { this.solids.add(this.key(tx, ty)); }

//     isSolidWorld(x: number, y: number): boolean {
//       const tx = Math.floor(x / TILE);
//       const ty = Math.floor(y / TILE);
//       return this.solids.has(this.key(tx, ty));
//     }
//   }
