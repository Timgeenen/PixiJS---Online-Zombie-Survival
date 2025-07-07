import type { ComponentData, Radian } from "../schemas";

export function getVelocity(rad: Radian, speed: number): ComponentData<'Velocity'> {
    return {
        vx: Math.cos(rad) * speed,
        vy: Math.sin(rad) * speed
    };
}