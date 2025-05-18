import type { Credentials } from '@monorepo/shared';
import { useRef, useState } from 'react';
import { guestLogin, login, register } from '../services/authServices';
import type { FormType, InputRefs } from '../types';
import CredentialFields from './CredentialFields';
import FormButtons from './FormButtons';
import FormFooter from './FormFooter';
import useAuthMutation from '../hooks/useAuthMutation';

function LoginForm() {
    const [currentForm, setCurrentForm] = useState<FormType>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const inputRefs = useRef<InputRefs>({});

    const loginMutation = useAuthMutation('login');
    const guestLoginMutation = useAuthMutation('guest');
    const registerMutation = useAuthMutation('register');

    function getCredentials(): void | Credentials {
        const username = inputRefs.current['username']?.value;
        const password = inputRefs.current['password']?.value;
        const email = inputRefs.current['email']?.value;

        if (!username || !password) {
            return alert('Missing credentials');
        }
        const credentials: Credentials = {
            username: username,
            password: password,
        };
        if (currentForm === 'register') {
            if (!email) {
                return alert('Missing email');
            }
            credentials.email = email;
        }
        return credentials;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const credentials = getCredentials();
        if (!credentials) {
            return alert('Missing credentials');
        }
        return currentForm === 'login' ? loginMutation.mutate(credentials) : registerMutation.mutate(credentials);
    }

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <form className="flex flex-col items-center gap-2" onSubmit={handleSubmit}>
                <CredentialFields
                    currentForm={currentForm}
                    username={username}
                    email={email}
                    password={password}
                    setUsername={setUsername}
                    setEmail={setEmail}
                    setPassword={setPassword}
                    inputRefs={inputRefs}
                />
                <FormButtons currentForm={currentForm} guestLogin={guestLogin} />
                {loginMutation.error && loginMutation.error.message}
                {registerMutation.error && registerMutation.error.message}
            </form>
            <FormFooter currentForm={currentForm} changeForm={setCurrentForm} />
        </div>
    );
}

export default LoginForm;
