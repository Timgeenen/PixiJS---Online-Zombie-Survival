import { TICK } from '@monorepo/shared';
import { useAuthStore, useSocketStore } from '@Store';
import { Application } from 'pixi.js';
import { useEffect, useRef, useState, type ReactElement } from 'react';
import ClientGame from '../classes/ClientGame';
import useCreateApp from '../hooks/useCreateApp';
import useCreateGame from '../hooks/useCreateGame';
import { registerGameSocket, unregisterGameSocket } from '../services/gameService';

function GameCanvas(): ReactElement {
    const [gameCreated, setGameCreated] = useState(false);
    const [appCreated, setAppCreated] = useState(false);
    const canvasRef = useRef<HTMLDivElement>(null);
    const appRef = useRef<Application>(null);
    const gameRef = useRef<ClientGame>(null);
    const { user } = useAuthStore((state) => state);
    const { socket } = useSocketStore(state => state);
    useCreateApp({ appRef, canvasRef, setAppCreated });
    useCreateGame(gameRef, appRef, appCreated, setGameCreated);

    useEffect(() => {
        if (!gameCreated || !appCreated || !gameRef.current || !appRef.current || !user) {
            return;
        }
        registerGameSocket(gameRef.current!);
        socket?.emit('game_player_ready', (response) => {
            if (!response.success) {
                return console.error(response.message);
            }
        })

        return () => {
            unregisterGameSocket()
        };
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
