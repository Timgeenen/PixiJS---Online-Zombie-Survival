import User from '@Models/User';
import type { Credentials } from '@monorepo/shared';

export async function isUsernameTaken(username: string) {
    const user = await User.findOne({ username });
    return !!user;
}

export async function isEmailTaken(email: string) {
    const user = await User.findOne({ email });
    return !!user;
}

export async function createNewUser(credentials: Credentials) {
    const user = await User.create(credentials);
    return user;
}
