import { useAuthStore } from '@Store';
import { useEffect, useRef, type Dispatch, type SetStateAction } from 'react';
import useSocketStore from 'src/store/useSocketStore';
import ClientGame from '../classes/ClientGame';
import InputManager from '../classes/inputManager';
import type { Application } from 'pixi.js';

function useCreateGame(
    gameRef: React.RefObject<ClientGame | null>,
    appRef: React.RefObject<Application | null>,
    appCreated: boolean,
    setGameCreated: Dispatch<SetStateAction<boolean>>,
): void {
    const inputManagerRef = useRef<InputManager>(null);
    const { socket } = useSocketStore((state) => state);
    // const { currentLobby } = useLobbyStore(state => state);
    const { user } = useAuthStore((state) => state);
    useEffect(() => {
        if (!socket?.connected || !appCreated) {
            return;
        }
        if (!appRef.current) {
            return console.error('Could not create game instance: application not found');
        }
        if (!user) {
            return console.error('Could not create game instance: user not found');
        }
        // if (!currentLobby) {
        //     return console.error('Could not create game instance: lobby not found');
        // }
        socket.emit('initialize_game', (response) => {
            if (!response.success) {
                return console.error('Could not create game: socket error');
            }
            const { gameSettings, keybindings } = user.settings;
            inputManagerRef.current = new InputManager(keybindings, gameSettings);
            inputManagerRef.current.register();
            gameRef.current = new ClientGame(
                response.data,
                inputManagerRef.current,
                appRef.current!,
                user._id,
            );
            setGameCreated(true);
        });
        return () => {
            inputManagerRef.current?.unregister();
        };
    }, [socket?.connected, appCreated]);
}

export default useCreateGame;
