import { AuthError } from '@Errors/customAppErrors';
import type { AuthenticatedRequest } from '@Types/api';

export function getUserIdFromReq(req: AuthenticatedRequest): string {
    const user_id = req.user_id;
    if (!user_id) {
        throw new AuthError('No user ID found in request');
    }
    return user_id;
}
