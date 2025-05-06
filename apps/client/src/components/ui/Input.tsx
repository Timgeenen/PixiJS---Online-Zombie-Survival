import clsx from 'clsx';
import type { ComponentPropsWithRef } from 'react';

function Input({ ...props }: ComponentPropsWithRef<'input'>) {
    return (
        <>
            <input
                {...props}
                className={clsx('border-green-400 border-2 rounded bg-slate-400', props.className)}
            />
        </>
    );
}

export default Input;
