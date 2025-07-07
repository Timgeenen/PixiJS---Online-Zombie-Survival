import { useSocketStore } from '@Store';

export default class NetworkSyncSystem {
    constructor() {}

    register() {
        const { socket } = useSocketStore.getState();
        if (!socket?.connected) {
            throw new Error('Could not register network sync system: socket not connected');
        }
    }
}
