import { Button } from '@Components';
import type { FormType } from '../types';

type Props = {
    currentForm: FormType;
    guestLogin: () => void;
};

function FormButtons({ currentForm, guestLogin }: Props) {
    return (
        <div className="flex justify-center mt-2 gap-2">
            <Button type="submit">{currentForm === 'login' ? 'Login' : 'Register'}</Button>
            <Button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    guestLogin();
                }}
            >
                Guest Login
            </Button>
        </div>
    );
}

export default FormButtons;
