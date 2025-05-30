import type { ComponentPropsWithRef } from 'react';
import type { FormType } from '../types';
import clsx from 'clsx';

type FormFooterProps = {
    currentForm: FormType;
    changeForm: React.Dispatch<React.SetStateAction<FormType>>;
};

function FormFooter({
    currentForm,
    changeForm,
    ...props
}: ComponentPropsWithRef<'a'> & FormFooterProps) {
    return (
        <p>
            {currentForm === 'register' ? 'Already registered? ' : 'New user? '}
            <a
                {...props}
                className={clsx('text-blue-400 hover:cursor-pointer')}
                onClick={() => changeForm(currentForm === 'login' ? 'register' : 'login')}
            >
                {currentForm === 'login' ? 'Sign up' : 'Log in'}
            </a>
        </p>
    );
}

export default FormFooter;
