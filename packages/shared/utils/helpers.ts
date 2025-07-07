import type { ComponentData, Radian } from "../schemas";

export function getVelocity(rad: Radian): ComponentData<'Velocity'> {
    return {
        vx: Math.cos(rad),
        vy: Math.sin(rad)
    };
}