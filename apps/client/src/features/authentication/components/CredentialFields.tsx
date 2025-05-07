import { LabeledInput } from '@Components';
import type { FormType, InputRefs } from '../types';

type Props = {
    currentForm: FormType;
    username: string;
    email: string;
    password: string;
    setUsername: (val: string) => void;
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
    inputRefs: React.RefObject<InputRefs>;
};

function CredentialFields({
    currentForm,
    username,
    email,
    password,
    setUsername,
    setEmail,
    setPassword,
    inputRefs,
}: Props) {
    return (
        <>
            <LabeledInput
                ref={(el) => {
                    inputRefs.current['username'] = el;
                }}
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
                    ref={(el) => {
                        inputRefs.current['email'] = el;
                    }}
                    htmlFor="Email"
                    type="email"
                    placeholder="e.g. user@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            )}
            <LabeledInput
                ref={(el) => {
                    inputRefs.current['password'] = el;
                }}
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
