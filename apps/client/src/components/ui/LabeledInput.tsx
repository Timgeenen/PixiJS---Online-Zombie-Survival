import type { ComponentPropsWithRef } from 'react';
import Label from './Label';
import Input from './Input';

function LabeledInput({ htmlFor, ...props }: ComponentPropsWithRef<'input'> & { htmlFor: string }) {
    return (
        <div className="flex flex-col w-60">
            <Label htmlFor={htmlFor} />
            <Input {...props} id={htmlFor} />
        </div>
    );
}

export default LabeledInput;
