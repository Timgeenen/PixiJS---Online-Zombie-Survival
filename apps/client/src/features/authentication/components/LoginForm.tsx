import { NavButton } from '@Components';

function LoginForm() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/main">Login</NavButton>
            <NavButton path="/main">Guest Login</NavButton>
        </div>
    );
}

export default LoginForm;
