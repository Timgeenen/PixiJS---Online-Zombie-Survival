import { LabeledInput } from '@Components';
import type { FormType } from '../types';

type Props = {
    currentForm: FormType;
    username: string;
    email: string;
    password: string;
    setUsername: (val: string) => void;
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
};

function CredentialFields({
    currentForm,
    username,
    email,
    password,
    setUsername,
    setEmail,
    setPassword,
}: Props) {
    return (
        <>
            <LabeledInput
                htmlFor="Username"
                type="text"
                placeholder="e.g. user2025"
                maxLength={20}
                minLength={4}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            {currentForm === 'register' && (
                <LabeledInput
                    htmlFor="Email"
                    type="email"
                    placeholder="e.g. user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            <LabeledInput
                htmlFor="Password"
                type="password"
                minLength={8}
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </>
    );
}

export default CredentialFields;
