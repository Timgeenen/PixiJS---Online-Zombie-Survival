import bcrypt from 'bcryptjs';
import { handleCatchError } from 'errors/handleErrors';

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(4);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        return handleCatchError(error);
    }
}

export async function comparePassword(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        return handleCatchError(error);
    }
}
