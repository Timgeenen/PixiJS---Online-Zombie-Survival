import type { LoginCredentials, RegisterCredentials } from '@monorepo/shared';
import { useState } from 'react';
import useAuthMutation from '../hooks/useAuthMutation';
import { guestLogin } from '../services/authServices';
import type { FormType } from '../types';
import CredentialFields from './CredentialFields';
import FormButtons from './FormButtons';
import FormFooter from './FormFooter';

function LoginForm() {
    const [currentForm, setCurrentForm] = useState<FormType>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const inputRefs = useRef<InputRefs>({});

    const loginMutation = useAuthMutation('login');
    const guestLoginMutation = useAuthMutation('guest');
    const registerMutation = useAuthMutation('register');

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (currentForm === 'login') {
            const credentials: LoginCredentials = {
                username,
                password,
            };
            loginMutation.mutate(credentials);
        }

        if (currentForm === 'register') {
            const credentials: RegisterCredentials = {
                username,
                password,
                email,
            };
            registerMutation.mutate(credentials);
        }
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
