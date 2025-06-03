import { HTTPClient } from '@API';
import type { ApiResponse, Lobby } from '@monorepo/shared';

export async function getLobbyById(id: string): Promise<ApiResponse<Lobby>> {
    return await HTTPClient.get(`/api/lobby/${id}`);
}
