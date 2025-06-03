import User from '@Models/User';
import type { RegisterCredentials } from '@monorepo/shared';
import type { DBUserOutput } from '@Types/db';

export async function isUsernameTaken(username: string): Promise<boolean> {
    const user = await User.findOne({ username });
    return !!user;
}

export async function isEmailTaken(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
}

export async function createNewUser(credentials: RegisterCredentials): Promise<DBUserOutput> {
    return await User.create(credentials);
}

export async function findUserByUsername(username: string): Promise<DBUserOutput | null> {
    return await User.findOne({ username });
}

export async function findUserById(userId: string): Promise<DBUserOutput | null> {
    return await User.findById(userId);
}
