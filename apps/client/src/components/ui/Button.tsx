import clsx from 'clsx';
import { type ComponentPropsWithRef } from 'react';

type ButtonProps = {
    type?: string;
} & ComponentPropsWithRef<'button'>;

function Button({ type = 'button', children, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={clsx('w-40 h-10 rounded text-gray-200 bg-green-500', props.className)}
        >
            {children}
        </button>
    );
}

export default Button;
