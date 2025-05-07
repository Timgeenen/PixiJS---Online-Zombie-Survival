import clsx from 'clsx';
import type { ComponentPropsWithRef } from 'react';

function Input({ ...props }: ComponentPropsWithRef<'input'>) {
    return (
        <>
            <input
                {...props}
                className={clsx('border-green-400 border-2 rounded h-8', props.className)}
            />
        </>
    );
}

export default Input;
