import {
    PlayerBaseTemplate,
    PlayerTemplates,
    SpawnSystem,
    type ComponentData,
    type Entity,
    type EntityTemplate,
    type GameEvent,
} from '@monorepo/shared';
import type ClientGame from './ClientGame';

export default class ClientSpawnSystem extends SpawnSystem<ClientGame> {
    constructor(game: ClientGame) {
        super(game);
    }

    override update(dt: number): void {
        const events = this.game.drainEvents('spawn');
        if (!events) {
            return;
        }
        for (const event of events) {
            // this.spawnEntity()
        }
    }

    // spawnEntity(): void {
    //     switch (event.entityType) {
    //         case 'player': return //this.spawnPlayer(event);
    //         case 'bullet': return;
    //         case 'effect': return;
    //         case 'enemy' : return;
    //         case 'item' : return;
    //         case 'obstacle': return;
    //         case 'pickup': return;
    //         case 'spawner': return;
    //         case 'weapon': return;
    //         default: console.error(`Could not spawn entity of type ${event.entityType}`)
    //     }
    // }

    // createTemplateComponents(template: EntityTemplate): Entity {
    //     const entity = this.game.createEntity()
    //     for (const key in template) {
    //         const typedKey = key as keyof typeof template;
    //         const value = template[typedKey] as ComponentData<typeof typedKey>;
    //         const map = this.game.getMap(typedKey);
    //         map.set(entity, value);
    //     }
    //     return entity;
    // }

    // spawnPlayer(event: GameEvent<'spawn'>): void  {
    //     const template = PlayerTemplates[event.templateRef];
    //     if (!template) { return console.error(`Could not spawn entity, template not found: ${event.templateRef}`)}
    //     const entity = this.createTemplateComponents({
    //         ...template,
    //         Position: { x: event.x, y: event.y },
    //         ...PlayerBaseTemplate
    //     });
    //     this.game.pushRenderEvent({ assetRef: event.templateRef, entity: entity});
    // }

    // spawnBullet() {
    // }
}
