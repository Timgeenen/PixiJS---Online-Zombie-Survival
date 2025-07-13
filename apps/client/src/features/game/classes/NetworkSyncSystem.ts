import {
    NetComponents,
    System,
    type ComponentData,
    type ComponentType,
    type Entity,
    type ServerPacket,
} from '@monorepo/shared';
import type ClientGame from './ClientGame';

export default class NetworkSyncSystem extends System {
    constructor(protected game: ClientGame) {
        super();
    }

    override update(dt: number): void {
        this._rootUpdate();
    }

    _rootUpdate(): void {
        const buffer = this.game.packetBuffer;
        let packetA: ServerPacket | null = null;
        let packetB: ServerPacket | null = null;
        for (let i = 0; i < buffer.length; i++) {
            if (buffer[i]!.tick > this.game.currentTick) {
                packetA = buffer[i]!;
                break;
            }
        }

        let j = buffer.length;
        while (j > 0) {
            if (buffer[j - 1]!.tick <= this.game.currentTick) {
                packetB = buffer[j - 1]!;
                break;
            }
            j--;
        }
        if (!packetA || !packetB) {
            return;
        }
        let componentIndexA = 0;
        let componentIndexB = 0;
        for (const [e, data] of Object.entries(packetA.data)) {
            if (!(e in packetB.data)) {
                continue;
            }
            for (let i = 0; i < NetComponents.Count; i++) {
                const mask = 1 << i;
                const bitIndex = Math.floor(i / 32);
                const prevSnap = packetB.data[Number(e)]!;
                if (data.mask.bits.length === 0 || prevSnap.mask.bits.length === 0) {
                    continue;
                }
                const componentA =
                    data.mask.bits[bitIndex]! & mask ? data.components[componentIndexA] : null;
                const componentB =
                    prevSnap.mask.bits[bitIndex]! & mask
                        ? prevSnap.components[componentIndexB]
                        : null;
                if (componentA) {
                    componentIndexA++;
                }
                if (componentB) {
                    componentIndexB++;
                }
                if (componentA && componentB) {
                    const component = NetComponents[i] as ComponentType;
                    const t =
                        (this.game.currentTick - packetB.tick) / (packetA.tick - packetB.tick);
                    this.handleInterpolate(Number(e), component, componentA, componentB, t);
                }
            }
        }
    }

    handleInterpolate<K extends ComponentType>(
        e: Entity,
        component: K,
        componentA: ComponentData<K>,
        componentB: ComponentData<K>,
        t: number,
    ) {
        switch (component) {
            case 'Position':
                this.interpolatePosition(
                    e,
                    componentA as ComponentData<'Position'>,
                    componentB as ComponentData<'Position'>,
                    t,
                );
                break;
            case 'HP':
                this.interpolateHP(
                    e,
                    componentA as ComponentData<'HP'>,
                    componentB as ComponentData<'HP'>,
                    t,
                );
                break;
            case 'Rotation':
                this.interpolateRotation(
                    e,
                    componentA as ComponentData<'Rotation'>,
                    componentB as ComponentData<'Rotation'>,
                    t,
                );
                break;
            case 'Ammo':
                this.interpolateAmmo(
                    e,
                    componentA as ComponentData<'Ammo'>,
                    componentB as ComponentData<'Ammo'>,
                    t,
                );
                break;
            case 'Velocity':
                this.interpolateVelocity(
                    e,
                    componentA as ComponentData<'Velocity'>,
                    componentB as ComponentData<'Velocity'>,
                    t,
                );
                break;
            default:
                break;
        }
    }

    interpolate(a: number, b: number, t: number): number {
        return a + (a - b) * t;
    }

    interpolateAmmo(
        e: Entity,
        componentA: ComponentData<'Ammo'>,
        componentB: ComponentData<'Ammo'>,
        t: number,
    ): void {
        const isInfinite = [
            componentA.max,
            componentA.total,
            componentB.max,
            componentB.total,
        ].includes('inf');
        this.game.getMap('Ammo').set(e, {
            current: Math.round(this.interpolate(componentA.current, componentB.current, t)),
            total: isInfinite
                ? 'inf'
                : this.interpolate(Number(componentA.total), Number(componentB.total), t),
            clipSize: this.interpolate(componentA.clipSize, componentB.clipSize, t),
            max: isInfinite
                ? 'inf'
                : this.interpolate(Number(componentA.max), Number(componentB.max), t),
        });
    }

    interpolatePosition(
        e: Entity,
        componentA: ComponentData<'Position'>,
        componentB: ComponentData<'Position'>,
        t: number,
    ): void {
        this.game.getMap('Position').set(e, {
            x: this.interpolate(componentA.x, componentB.x, t),
            y: this.interpolate(componentA.y, componentB.y, t),
        });
    }

    interpolateHP(
        e: Entity,
        componentA: ComponentData<'HP'>,
        componetB: ComponentData<'HP'>,
        t: number,
    ): void {
        this.game.getMap('HP').set(e, {
            current: Math.max(
                0,
                Math.round(this.interpolate(componentA.current, componetB.current, t)),
            ),
            max:
                componentA.max !== componetB.max
                    ? Math.max(0, Math.round(this.interpolate(componentA.max, componetB.max, t)))
                    : componentA.max,
        });
    }

    interpolateRotation(
        e: Entity,
        componentA: ComponentData<'Rotation'>,
        componentB: ComponentData<'Rotation'>,
        t: number,
    ): void {
        this.game.getMap('Rotation').set(e, {
            rad: Math.max(0, this.interpolate(componentA.rad, componentB.rad, t)),
        });
    }

    interpolateVelocity(
        e: Entity,
        componentA: ComponentData<'Velocity'>,
        componentB: ComponentData<'Velocity'>,
        t: number,
    ): void {
        this.game.getMap('Velocity').set(e, {
            vx: this.interpolate(componentA.vx, componentB.vx, t),
            vy: this.interpolate(componentA.vy, componentB.vy, t),
        });
    }
}
