import { baseLobbyBaseSchema, myProfileSchema, registerCredentialsSchema } from '@monorepo/shared';

export const DBLobbyInputSchema = baseLobbyBaseSchema.pick({ settings: true });
export const DBUserInputSchema = myProfileSchema
    .omit({ _id: true })
    .extend(registerCredentialsSchema.shape);
