import type { ComponentPropsWithRef } from 'react';
import { NavLink } from 'react-router';
import Button from './Button';

type NavButtonProps = {
    path: string;
} & ComponentPropsWithRef<'button'>;

function NavButton({ path, children, ...props }: NavButtonProps) {
    return (
        <NavLink to={path}>
            <Button {...props}>{children}</Button>
        </NavLink>
    );
}

export default NavButton;
