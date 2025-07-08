import { Game, System, type ComponentData, type Entity, type Position, type Radian } from '@monorepo/shared';
import type ClientGame from './ClientGame';
import { AnimatedSprite, Assets, Sprite, Spritesheet, Texture, TextureSource, type Application } from 'pixi.js';

export default class RenderSystem extends System {
    spriteMap = new Map<Entity, Sprite | AnimatedSprite>();
    animations: Record<string | number, Texture<TextureSource<any>>[]> = {}
    constructor(
        private game: ClientGame,
        private app: Application,
    ) {
        super();
    }

    override update(dt: number) {
        const queue = this.game.queues.justSpawned.splice(0);
        if (queue.length > 0) {
            for (const event of queue) {
                this.createSprite(event.entity);
            }
        }
        for (const [e, sprite] of this.spriteMap) {
            const pos = this.game.positionMap.get(e);
            if (pos) {
                sprite.x = pos.x;
                sprite.y = pos.y;
            }
            if (sprite instanceof AnimatedSprite) {
                const rotation = this.game.rotationMap.get(e);
                const justRotated = this.game.justRotatedMap.get(e);
                if (rotation && justRotated) {   
                    this.handleRotation(rotation, sprite)
                }

                const isMoving = this.isMoving(e);
                if (isMoving && !sprite.playing) {
                    sprite.play();
                } else if (!isMoving && sprite.playing) {
                    sprite.stop();
                }
            }
        }
        this.game.justRotatedMap.clear();
    }

    isMoving(e: Entity): boolean {
        const velocity = this.game.velocityMap.get(e);
        if (!velocity || (velocity.vx === 0 && velocity.vy === 0)) {
            return false;
        }
        return true
    }

    handleRotation(rotation: ComponentData<'Rotation'>, sprite: AnimatedSprite): void {
        if (this.isFacingRight(rotation.rad)) {
            // sprite.rotation = rotation.rad;
            const spritesheet: Spritesheet = Assets.get('player')
            sprite.textures = spritesheet.animations['right']!
            sprite.animationSpeed = .15;
            sprite.loop = true;

            sprite.play();
            return;
        }
        if (this.isFacingLeft(rotation.rad)) {
            // sprite.rotation = rotation.rad - Math.PI;
            const spritesheet: Spritesheet = Assets.get('player')
            sprite.textures = spritesheet.animations['left']!
            sprite.animationSpeed = .15;
            sprite.loop = true;

            sprite.play();
            return
        }
        if (this.isFacingUp(rotation.rad)) {
            const spritesheet: Spritesheet = Assets.get('player')
            sprite.textures = spritesheet.animations['up']!
            sprite.animationSpeed = .15;
            sprite.loop = true;

            sprite.play();
            return
        }
        if (this.isFacingDown(rotation.rad)) {
            const spritesheet: Spritesheet = Assets.get('player')
            sprite.textures = spritesheet.animations['down']!
            sprite.animationSpeed = .15;
            sprite.loop = true;
            sprite.play();
            return
        }
        sprite.rotation = 0
    }

    isFacingUp(rad: Radian): boolean {
        return (rad <= ((Math.PI * 7) / 4) && rad >= ((Math.PI * 5) / 4));
    }
    isFacingDown(rad: Radian): boolean {
        return (rad <= ((Math.PI * 3) / 4) && rad >= ((Math.PI) / 4));
    }
    isFacingLeft(rad: Radian): boolean {
        return (rad < ((Math.PI * 5) / 4) && rad > ((Math.PI * 3) / 4))
    }
    isFacingRight(rad: Radian): boolean {
        return (rad > ((Math.PI * 7) / 4) || rad < (Math.PI / 4))
    }

    isAnimated(sprite: Sprite | AnimatedSprite): sprite is AnimatedSprite {
        return sprite instanceof AnimatedSprite
    }

    createSprite(e: Entity) {
        const entityType = this.game.entityTypeMap.get(e)!;
        switch (entityType.name) {
            case 'bullet': this.createBulletSprite(e); break;
            case 'player': this.createPlayerSprite(e); break;
        }
    }

    removeSprite(e: Entity) {
        const sprite = this.spriteMap.get(e);
        if (sprite) {
            this.app.stage.removeChild(sprite);
            this.spriteMap.delete(e);
        }
    }


    createBulletSprite(e: Entity) {
        const bulletRef = this.game.ammoTypeMap.get(e);
        if(!bulletRef) { return console.error('Could not render bullet: no bullet sprite found') }
        const bullet: Texture = Assets.get(bulletRef.name);
        const sprite = Sprite.from(bullet);
        sprite.width = 16;
        sprite.height = 16;
        this.spriteMap.set(e, sprite);
        this.addSpriteToCanvas(e, sprite);
    }

    createPlayerSprite(e: Entity) {
        const spritesheet: Spritesheet = Assets.get('player')
        const animation = spritesheet.animations['down']!;
        // const down = animations['down']!
        const sprite = new AnimatedSprite(animation);
        sprite.animationSpeed = .1
        sprite.loop = true
        sprite.play();
        // const textures = spritesheet.textures['zombie2'];
        // const sprite = new Sprite(textures);
        this.spriteMap.set(e, sprite);
        this.addSpriteToCanvas(e, sprite);
    }

    addSpriteToCanvas(e: Entity, sprite: Sprite) {
        this.app.stage.addChild(sprite);
        const position = this.game.positionMap.get(e);
        const rotation = this.game.rotationMap.get(e);
        sprite.x = position?.x ?? 0;
        sprite.y = position?.y ?? 0;
        sprite.rotation = rotation?.rad ?? 0;
        sprite.anchor = .5;
    }
}
