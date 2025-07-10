import { Application, Assets } from 'pixi.js';
import { useCallback, useEffect, type Dispatch, type SetStateAction } from 'react';
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
        await Assets.init({ manifest });
        await Assets.loadBundle(['bullets', 'players']);
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
