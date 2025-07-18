import type { Game } from '../core';
import type { Entity, InputSnapshot, InputState, Radian } from '../schemas';
import System from './System';

export default class InputSystem<G extends Game> extends System {
    snapshots: Map<Entity, InputSnapshot[]>;

    constructor(protected game: G) {
        super();
        this.snapshots = new Map();
    }

    override update(dt: number): void {
        this._rootUpdate(dt);
    }

    protected _rootUpdate(dt: number) {
        for (const [entity, snapQueue] of this.snapshots) {
            if (snapQueue.length === 0) {
                continue;
            }
            const inputState = this.getInputState(snapQueue, entity);
            const { mx, my, aim } = inputState;
            this.handleRotation(entity, aim);
            this.game.updateComponent(entity, 'InputState', inputState);
            this.game.updateComponent(entity, 'Velocity', { vx: mx, vy: my });
            this.snapshots.set(entity, []);
        }
    }

    handleRotation(entity: Entity, aim: Radian) {
        this.game.updateComponent(entity, 'Rotation', { rad: aim });
    }

    private getInputState(queue: InputSnapshot[], entity: Entity): InputState {
        let shoot = 0;
        let reload = 0;
        let changeWeapon = 0;
        for (const snap of queue) {
            if (snap.tick < this.game.currentTick) {
                break;
            }
            changeWeapon += snap.changeWeapon;
            if (snap.reload === 1 && reload === 0) {
                reload = 1;
            }
            if (shoot === 0 && snap.shoot === 1) {
                shoot = 1;
            }
        }
        if (changeWeapon === 1) {
            this.game.createComponent(entity, 'SwitchWeapon', { count: changeWeapon });
        }
        const { mx, my, aim } = queue[queue.length - 1]!;
        return {
            mx,
            my,
            shoot,
            reload,
            aim,
            tick: this.game.currentTick,
        };
    }
}
