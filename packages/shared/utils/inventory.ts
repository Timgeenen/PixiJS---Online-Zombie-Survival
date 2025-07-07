import { MAX_WEAPON_INV } from "../constants";
import type { Game } from "../core";
import type { Entity } from "../schemas";

export function addWeaponToInv<G extends Game>(game: G, weapon: Entity, owner: Entity) {
    const weaponInv = game.weaponInventoryMap.get(owner);
    if (!weaponInv) { return }
    if (weaponInv.entities.length > MAX_WEAPON_INV) { return }
    weaponInv.entities.push(weapon);
    game.updateComponent(owner, 'WeaponInventory', weaponInv);
}