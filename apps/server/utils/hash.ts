import bcrypt from 'bcryptjs';
import { InternalServerError } from 'errors/customAppErrors';

export async function hashPassword(password: string) {
    try {
        const salt = await bcrypt.genSalt(4);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new InternalServerError('Error while hasing password with bcrypt');
    }
}

export async function comparePassword(password: string, hash: string) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        throw new InternalServerError('Error while comparing passwords with bcrypt');
    }
}
