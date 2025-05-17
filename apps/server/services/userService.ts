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
    return await User.create(credentials);
}

export async function findUserByUsername(username: string) {
    return await User.findOne({ username });
}

export async function findUserById(userId: string) {
    return await User.findOne({ _id: userId });
}
