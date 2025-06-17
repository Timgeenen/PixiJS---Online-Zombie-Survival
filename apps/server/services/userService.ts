import User from '@Models/User';
import type { RegisterCredentials } from '@monorepo/shared';
import type { DBUser } from '@Types/db';
import { docToObject } from '@Utils/dbHelpers';

export async function isUsernameTaken(username: string): Promise<boolean> {
    const user = await User.findOne({ username });
    return !!user;
}

export async function isEmailTaken(email: string): Promise<boolean> {
    const user = await User.findOne({ email });
    return !!user;
}

export async function createNewUser(credentials: RegisterCredentials): Promise<DBUser | null> {
    const userDoc = await User.create(credentials);
    return userDoc ? docToObject(userDoc) : null;
}

export async function findUserByUsername(username: string): Promise<DBUser | null> {
    const userDoc = await User.findOne({ username });
    return userDoc ? docToObject(userDoc) : null;
}

export async function findUserById(userId: string): Promise<DBUser | null> {
    const userDoc = await User.findById(userId);
    return userDoc ? docToObject(userDoc) : null;
}
