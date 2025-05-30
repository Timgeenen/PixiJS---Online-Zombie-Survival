import { lobbySettingsSchema, type LobbySettings } from '@monorepo/shared';
import { useMutation } from '@tanstack/react-query';
import { createNewLobby } from '../services/lobbyServices';
import { useNavigate } from 'react-router';

function useCreateLobbyMutation() {
    const navigate = useNavigate();
    return useMutation({
        mutationFn: async (settings: LobbySettings) => {
            const result = lobbySettingsSchema.safeParse(settings);
            if (result.error) {
                console.error(result.error);
                throw new Error('Invalid lobby settings');
            }
            return await createNewLobby(settings);
        },
        onSuccess: (data) => {
            navigate(`/lobby/${data?.data?._id}`, {
                state: data?.data,
            });
        },
        onError: (error: any) => {
            console.error(error);
            const message = error.response?.data?.error || 'Something went wrong';
            error.message = message;
        },
    });
}

export default useCreateLobbyMutation;
