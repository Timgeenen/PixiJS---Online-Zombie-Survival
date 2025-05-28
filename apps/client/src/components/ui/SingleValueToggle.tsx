import clsx from 'clsx';
import type { ComponentPropsWithRef } from 'react';

interface Props {
    htmlFor: string;
    isSelected: boolean;
}

function SingleValueToggle({
    isSelected,
    htmlFor,
    ...props
}: ComponentPropsWithRef<'input'> & Props) {
    return (
        <label htmlFor={htmlFor} className={clsx(isSelected && 'text-green-500')}>
            <input id={htmlFor} type="checkbox" className="appearance-none" {...props} />
            {htmlFor}
        </label>
    );
}

export default SingleValueToggle;
