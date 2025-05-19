import { HTTPClient } from '@API';
import type { ApiResponse } from '@monorepo/shared';

export async function authorizeUser(): Promise<ApiResponse<undefined>> {
    const response: ApiResponse<undefined> = await HTTPClient.get('/api/auth/authorize');
    return response;
}
