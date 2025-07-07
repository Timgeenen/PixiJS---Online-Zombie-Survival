import { useAuthStore } from '@Store';
import { Application, Assets, Sprite, Spritesheet } from 'pixi.js';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import ClientGame from '../classes/ClientGame';
import useCreateApp from '../hooks/useCreateApp';
import useCreateGame from '../hooks/useCreateGame';
import { TICK } from '@monorepo/shared';

function GameCanvas(): ReactElement {
    const [gameCreated, setGameCreated] = useState(false);
    const [appCreated, setAppCreated] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application>(null);
    const gameRef = useRef<ClientGame>(null);
    const { user } = useAuthStore((state) => state);
    useCreateApp({ appRef, canvasRef, setAppCreated });
    useCreateGame(gameRef, appRef, appCreated, setGameCreated);

    useEffect(() => {
        if (!gameCreated || !appCreated || !gameRef.current || !appRef.current || !user) {
            return;
        }
        // for (const [key, value] of gameRef.current.playerMap.entries()) {
        //     const position = gameRef.current!.positionMap.get(key);
        //     if (!position) {
        //         return console.error('Could not render player: position not found in postionmap');
        //     }
        //     // const spritesheet: Spritesheet = Assets.get('player');
        //     // const texture = spritesheet.textures[`zombie2`];
        //     // const PlayerSprite = new Sprite(texture);
        //     // PlayerSprite.position = position;
        //     // appRef.current!.stage.addChild(PlayerSprite);
        //     // appRef.current.ticker.add(() => {
        //     //     PlayerSprite.x += 5;
        //     //     PlayerSprite.y += 5;
        //     // });
        // }
        setInterval(() => {
            gameRef.current?.update(TICK);
        }, TICK);

        return () => {};
    }, [gameCreated, appCreated]);

    return (
        <>
            <div ref={canvasRef} />
            <button
                onClick={() => {
                    appRef.current?.start();
                }}
            >
                Start
            </button>
        </>
    );
}

export default GameCanvas;
