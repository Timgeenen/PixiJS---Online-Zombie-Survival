import { Game, System, type Entity, type Position } from '@monorepo/shared';
import type ClientGame from './ClientGame';
import { Assets, Sprite, Spritesheet, Texture, type Application } from 'pixi.js';

export default class RenderSystem extends System {
    sprites = new Map<Entity, Sprite>();
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
        for (const [e, sprite] of this.sprites) {
            const pos = this.game.positionMap.get(e);
            if (pos) {
                sprite.x = pos.x;
                sprite.y = pos.y;
            }
        }
    }

    createSprite(e: Entity) {
        const entityType = this.game.entityTypeMap.get(e)!;
        switch (entityType.name) {
            case 'bullet': this.createBulletSprite(e); break;
            case 'player': this.createPlayerSprite(e); break;
        }
        // const spritesheet: Spritesheet = Assets.get(assetRef);
        // const textures = spritesheet.textures['zombie2'];
        // const sprite = new Sprite(textures);
        // this.sprites.set(e, sprite);
        // this.app.stage.addChild(sprite);
    }

    removeSprite(e: Entity) {
        const sprite = this.sprites.get(e);
        if (sprite) {
            this.app.stage.removeChild(sprite);
            this.sprites.delete(e);
        }
    }


    createBulletSprite(e: Entity) {
        const bulletRef = this.game.ammoTypeMap.get(e);
        if(!bulletRef) { return }
        const bullet: Texture = Assets.get(bulletRef.name);
        const sprite = Sprite.from(bullet);
        this.sprites.set(e, sprite);
        this.addSpriteToCanvas(e, sprite);
    }

    createPlayerSprite(e: Entity) {
        const spritesheet: Spritesheet = Assets.get('player');
        const textures = spritesheet.textures['zombie2'];
        const sprite = new Sprite(textures);
        this.sprites.set(e, sprite);
        this.addSpriteToCanvas(e, sprite);
    }

    addSpriteToCanvas(e: Entity, sprite: Sprite) {
        this.app.stage.addChild(sprite);
        const position = this.game.positionMap.get(e);
        sprite.x = position?.x ?? 0;
        sprite.y = position?.y ?? 0;
    }
}
