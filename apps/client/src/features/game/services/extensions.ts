import { ExtensionType, Application, extensions } from 'pixi.js';

class ShootExtension {
    static extension = {
        type: ExtensionType.Application,
        name: 'shootExtension',
    };

    static init(app: Application) {
        Object.defineProperty(app, 'shoot', {
            value: () => {
                console.log('SHOOTING!');
            },
            writable: false,
        });
    }
}
extensions.add(ShootExtension);
