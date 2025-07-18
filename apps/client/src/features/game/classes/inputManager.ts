import type {
    ComponentData,
    GameSettings,
    InputSnapshot,
    Keybindings,
    Radian,
} from '@monorepo/shared';

export type InputState = {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    mx: number;
    my: number;
    aim: number;
    shoot: boolean;
    aimUp: boolean;
    aimDown: boolean;
    aimLeft: boolean;
    aimRight: boolean;
};

export default class InputManager {
    private readonly onKeydown = (e: KeyboardEvent) => this.handleKeydown(e);
    private readonly onKeyUp = (e: KeyboardEvent) => this.handleKeyup(e);
    private readonly keybindings: Record<string, keyof Keybindings>;
    private seq = 0;
    private prevInputState = '';
    private state = {
        mx: 0,
        my: 0,
        aim: Math.PI,
        shoot: false,
        reload: false,
        changeWeapon: 0,
    };
    private inputState = {
        up: false,
        down: false,
        left: false,
        right: false,
        aimUp: false,
        aimDown: false,
        aimLeft: false,
        aimRight: false,
        shoot: false,
        reload: false,
    };
    private pressed = {
        up: false,
        down: false,
        left: false,
        right: false,
        aimUp: false,
        aimDown: false,
        aimLeft: false,
        aimRight: false,
        shoot: false,
    };
    queue: Omit<InputSnapshot, 'tick'>[];

    constructor(
        keybindings: Keybindings,
        private gameSettings: GameSettings,
    ) {
        const reverted: Record<string, keyof Keybindings> = {};
        for (const event in keybindings) {
            const typedEvent = event as keyof typeof keybindings;
            const key = keybindings[typedEvent];
            reverted[key] = typedEvent;
        }
        this.keybindings = reverted;
        this.queue = [];
    }

    register(): void {
        window.addEventListener('keydown', this.onKeydown);
        window.addEventListener('keyup', this.onKeyUp);
    }

    unregister(): void {
        window.removeEventListener('keydown', this.onKeydown);
        window.removeEventListener('keyup', this.onKeyUp);
    }

    drain(): Omit<InputSnapshot, 'tick'>[] {
        const inputs = this.queue;
        this.queue = [];
        return inputs;
    }

    getMovement(radian: Radian | null): { mx: number; my: number } {
        if (radian) {
            return {
                mx: Math.cos(radian),
                my: Math.sin(radian),
            };
        }
        return { mx: 0, my: 0 };
    }

    addSnapshot() {
        const inputState = JSON.stringify(this.inputState);
        if (this.prevInputState && this.prevInputState === inputState) {
            return;
        }
        const { aimLeft, aimRight, aimUp, aimDown, left, right, up, down } = this.inputState;
        const aimRadian = this.getRadian(aimLeft, aimRight, aimUp, aimDown);
        const walkRadian = this.getRadian(left, right, up, down);
        const { mx, my } = this.getMovement(walkRadian);
        const snapshot = {
            mx,
            my,
            shoot: this.inputState.shoot ? 1 : 0,
            aim: aimRadian ?? walkRadian ?? this.state.aim,
            reload: this.inputState.reload ? 1 : 0,
            changeWeapon: this.state.changeWeapon,
        };
        this.state.changeWeapon = 0;
        this.state.aim = snapshot.aim;
        this.prevInputState = inputState;
        this.queue.push(snapshot);
    }

    getRadian(left: boolean, right: boolean, up: boolean, down: boolean): Radian | null {
        if (left) {
            return up ? (5 * Math.PI) / 4 : down ? (3 * Math.PI) / 4 : Math.PI;
        }
        if (right) {
            return up ? (7 * Math.PI) / 4 : down ? Math.PI / 4 : 2 * Math.PI;
        }
        if (up) {
            return left ? (5 * Math.PI) / 4 : right ? (7 * Math.PI) / 4 : (3 * Math.PI) / 2;
        }
        if (down) {
            return left ? (3 * Math.PI) / 4 : right ? Math.PI / 4 : Math.PI / 2;
        }
        return null;
    }

    // getLiveState(): Readonly<Pick<InputState, 'aim' | 'mx' | 'my' | 'shoot'>> {
    //     const { mx, my, aim, shoot } = this.state;
    //     return {
    //         mx,
    //         my,
    //         aim,
    //         shoot,
    //     };
    // }

    handleKeyup(e: KeyboardEvent): void {
        e.preventDefault();

        const event = this.keybindings[e.key.toUpperCase()];
        if (!event) return;

        switch (event) {
            case 'up':
                return this.handleKeyupUp();
            case 'down':
                return this.handleKeyupDown();
            case 'left':
                return this.handleKeyupLeft();
            case 'right':
                return this.handleKeyupRight();
            case 'aimUp':
                return this.handleKeyupAimUp();
            case 'aimDown':
                return this.handleKeyupAimDown();
            case 'aimLeft':
                return this.handleKeyupAimLeft();
            case 'aimRight':
                return this.handleKeyupAimRight();
            case 'shoot':
                return this.handleKeyupShoot();
            case 'reload':
                return this.handleKeyupReload();
            case 'nextWeapon':
                return;
            case 'prevWeapon':
                return;
            default:
                console.error('Unhandled keyboard event', event);
        }
    }

    handleKeydown(e: KeyboardEvent): void {
        e.preventDefault();

        const event = this.keybindings[e.key.toUpperCase()];
        if (!event) return;

        switch (event) {
            case 'up':
                return this.handleKeydownUp();
            case 'down':
                return this.handleKeydownDown();
            case 'left':
                return this.handleKeydownLeft();
            case 'right':
                return this.handleKeydownRight();
            case 'aimUp':
                return this.handleKeydownAimUp();
            case 'aimDown':
                return this.handleKeydownAimDown();
            case 'aimLeft':
                return this.handleKeydownAimLeft();
            case 'aimRight':
                return this.handleKeydownAimRight();
            case 'shoot':
                return this.handleKeydownShoot();
            case 'reload':
                return this.handleKeydownReload();
            case 'nextWeapon':
                return this.handleKeydownNextWeapon();
            case 'prevWeapon':
                return this.handleKeydownPrevWeapon();
            default:
                console.error('Unhandled keyboard event', event);
        }
    }

    isAiming(): boolean {
        if (
            this.inputState.aimDown ||
            this.inputState.aimUp ||
            this.inputState.aimLeft ||
            this.inputState.aimRight
        ) {
            return true;
        }
        return false;
    }

    handleKeydownReload(): void {
        this.inputState.reload = true;
        this.addSnapshot();
    }
    handleKeyupReload(): void {
        this.inputState.reload = false;
        this.addSnapshot();
    }

    handleKeydownNextWeapon(): void {
        this.state.changeWeapon += 1;
    }
    handleKeydownPrevWeapon(): void {
        this.state.changeWeapon -= 1;
    }

    handleKeydownUp(): void {
        this.inputState.down = false;
        this.inputState.up = true;
        this.pressed.up = true;
        this.addSnapshot();
    }
    handleKeyupUp(): void {
        this.inputState.up = false;
        this.pressed.up = false;
        if (this.pressed.down) {
            this.handleKeydownDown();
        }
        this.addSnapshot();
    }

    handleKeydownDown(): void {
        this.inputState.up = false;
        this.inputState.down = true;
        this.pressed.down = true;
        this.addSnapshot();
    }
    handleKeyupDown(): void {
        this.inputState.down = false;
        this.pressed.down = false;
        if (this.pressed.up) {
            this.handleKeydownUp();
        }
        this.addSnapshot();
    }

    handleKeydownLeft(): void {
        this.inputState.right = false;
        this.inputState.left = true;
        this.pressed.left = true;
        this.addSnapshot();
    }
    handleKeyupLeft(): void {
        this.inputState.left = false;
        this.pressed.left = false;
        if (this.pressed.right) {
            this.handleKeydownRight();
        }
        this.addSnapshot();
    }

    handleKeydownRight(): void {
        this.inputState.left = false;
        this.inputState.right = true;
        this.pressed.right = true;
        this.addSnapshot();
    }
    handleKeyupRight(): void {
        this.inputState.right = false;
        this.pressed.right = false;
        if (this.pressed.left) {
            this.handleKeydownLeft();
        }
        this.addSnapshot();
    }

    handleKeydownAimUp(): void {
        this.inputState.aimDown = false;
        this.inputState.aimUp = true;
        this.pressed.aimUp = true;
        this.handleShootOnAim();
        this.addSnapshot();
    }
    handleKeyupAimUp(): void {
        this.inputState.aimUp = false;
        this.pressed.aimUp = false;
        if (this.pressed.aimDown) {
            this.handleKeydownAimDown();
        }
        this.handleStopShootOnAim();
        this.addSnapshot();
    }

    handleKeydownAimDown(): void {
        this.inputState.aimUp = false;
        this.inputState.aimDown = true;
        this.pressed.aimDown = true;
        this.handleShootOnAim();
        this.addSnapshot();
    }
    handleKeyupAimDown(): void {
        this.inputState.aimDown = false;
        this.pressed.aimDown = false;
        if (this.pressed.aimUp) {
            this.handleKeydownAimUp();
        }
        this.handleStopShootOnAim();
        this.addSnapshot();
    }

    handleKeydownAimLeft(): void {
        this.inputState.aimRight = false;
        this.inputState.aimLeft = true;
        this.pressed.aimLeft = true;
        this.handleShootOnAim();
        this.addSnapshot();
    }
    handleKeyupAimLeft(): void {
        this.inputState.aimLeft = false;
        this.pressed.aimLeft = false;
        if (this.pressed.aimRight) {
            this.handleKeydownAimRight();
        }
        this.handleStopShootOnAim();
        this.addSnapshot();
    }

    handleKeydownAimRight(): void {
        this.inputState.aimLeft = false;
        this.inputState.aimRight = true;
        this.pressed.aimRight = true;
        this.handleShootOnAim();
        this.addSnapshot();
    }
    handleKeyupAimRight(): void {
        this.inputState.aimRight = false;
        this.pressed.aimRight = false;
        if (this.pressed.aimLeft) {
            this.handleKeydownAimLeft();
        }
        this.handleStopShootOnAim();
        this.addSnapshot();
    }

    handleKeyupShoot(): void {
        this.inputState.shoot = false;
        this.pressed.shoot = false;
        this.addSnapshot();
    }

    handleKeydownShoot(): void {
        this.inputState.shoot = true;
        this.pressed.shoot = true;
        this.addSnapshot();
    }

    handleStopShootOnAim(): void {
        if (!this.isAiming() && this.gameSettings.shootOnAim) {
            this.inputState.shoot = false;
        }
    }
    handleShootOnAim(): void {
        if (this.gameSettings.shootOnAim) {
            this.inputState.shoot = true;
        }
    }
}
