import { useRef, useState } from 'react';
import { login, register } from '../services/authServices';
import type { FormType, InputRefs } from '../types';
import CredentialFields from './CredentialFields';
import FormButtons from './FormButtons';
import FormFooter from './FormFooter';
import type { Credentials } from '@monorepo/shared';

function LoginForm() {
    const [currentForm, setCurrentForm] = useState<FormType>('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const inputRefs = useRef<InputRefs>({});

    function getCredentials() {
        const username = inputRefs.current['username']?.value;
        const password = inputRefs.current['password']?.value;
        const email = inputRefs.current['email']?.value;

        if (!username || !password) {
            return alert('Invalid credentials');
        }
        const credentials: Credentials = {
            username: username,
            password: password,
        };
        if (currentForm === 'register') {
            credentials.email = email;
        }
        return credentials;
    }

    const handleSubmit = currentForm === 'login' ? login : register;

    function guestLogin() {
        console.log('CREATE GUEST USER');
    }

    return (
        <div className="flex flex-col gap-2 items-center justify-center">
            <form
                className="flex flex-col items-center gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    const credentials = getCredentials();
                    credentials && handleSubmit(credentials);
                }}
            >
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
            </form>
            <FormFooter currentForm={currentForm} changeForm={setCurrentForm} />
        </div>
    );
}

export default LoginForm;
