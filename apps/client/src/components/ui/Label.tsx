import type { ComponentPropsWithRef } from 'react';
import clsx from 'clsx';

function Label({
    htmlFor,
    ...props
}: ComponentPropsWithRef<'label'> & {
    htmlFor: string;
}) {
    return (
        <label {...props} htmlFor={htmlFor} className={clsx('text-sm ml-1', props.className)}>
            {htmlFor}
        </label>
    );
}

export default Label;
