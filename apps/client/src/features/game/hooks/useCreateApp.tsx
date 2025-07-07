import { Application, Assets, Particle, ParticleContainer } from 'pixi.js';
import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
import { getSprite } from '../utils/gameHelpers';
import { manifest } from '../data/manifest';

type Props = {
    appRef: React.RefObject<Application | null>;
    canvasRef: React.RefObject<HTMLDivElement | null>;
    setAppCreated: Dispatch<SetStateAction<boolean>>;
};

function useCreateApp({ appRef, canvasRef, setAppCreated }: Props): void {
    const init = useCallback(async (signal: AbortSignal): Promise<Application | void> => {
        const canvas = canvasRef.current;
        const app = new Application();
        await app.init({
            // width: 800,
            // height: 600,
            // antialias: true,
            // resolution: window.devicePixelRatio,
            // preference: 'webgl',
            backgroundColor: 'black',
            // autoStart: false,
        });
        if (signal.aborted) {
            return app.destroy();
        }
        app.resizeTo = window;
        appRef.current = app;
        canvas?.appendChild(app.canvas);
        //init asset manifest
        //load bundles
        await Assets.init({ manifest });
        await Assets.loadBundle(['bullets', 'players']);
        //   const container = new ParticleContainer({
        //     dynamicProperties: {
        //         scale: false,
        //         position: true,
        //         rotation: true,
        //         uvs: false,
        //         alpha: false,
        //     }
        //   })
        //   const bullet = Assets.get('shotgun_bullet');
        //   window.addEventListener('keydown', () => {
        //     for (let i = 0; i < 100; i++) {
        //         const particle = new Particle({
        //             texture: bullet,
        //             x: Math.random() * window.innerWidth,
        //             y: Math.random() * window.innerHeight,
        //             rotation: Math.PI * Math.random()
        //         })
        //         container.addParticle(particle)
        //     }
        //     app.stage.addChild(container)
        //   bullet.x = Math.random() * window.innerWidth;
        //   bullet.y = Math.random() * window.innerHeight;
        //   app.ticker.add(() => {
        //     bullet.x += Math.random() * 10
        //     bullet.y += Math.random() * 10
        //   })
        //   app.stage.addChild(bullet)
        //   })
        setAppCreated(true);
        return app;
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        const app = appRef.current;
        if (!app) {
            init(signal);
        }
        return () => {
            controller.abort();
            if (app) {
                setAppCreated(false);
                app.destroy();
            }
        };
    }, [init]);
}

export default useCreateApp;
