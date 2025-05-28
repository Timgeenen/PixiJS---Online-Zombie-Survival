import clsx from 'clsx';

interface RequiredInputProps {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value: string;
}

type CustomInputProps = RequiredInputProps &
    Omit<React.HtmlHTMLAttributes<HTMLInputElement>, keyof RequiredInputProps>;

interface Props {
    leftInputProps: CustomInputProps;
    RightInputProps: CustomInputProps;
    name: string;
    currentValue: string;
}

function TwoWaySwitch({ leftInputProps, RightInputProps, name, currentValue }: Props) {
    const activeStyles = 'text-green-500';
    return (
        <div>
            <label
                className={clsx(
                    'cursor-pointer px-4 py-2 rounded border border-gray-300 bg-gray-100 peer-checked:bg-red-500 peer-checked:text-white transition',
                    currentValue === leftInputProps.value && activeStyles,
                )}
            >
                <input
                    {...leftInputProps}
                    type="radio"
                    name={name}
                    className={clsx('peer hidden')}
                    checked={currentValue === leftInputProps.value}
                />
                {leftInputProps.value}
            </label>
            <label
                className={clsx(
                    'cursor-pointer px-4 py-2 rounded border border-gray-300 bg-gray-100 peer-checked:bg-red-500 peer-checked:text-white transition',
                    currentValue === RightInputProps.value && activeStyles,
                )}
            >
                <input
                    {...RightInputProps}
                    type="radio"
                    name={name}
                    className={clsx(
                        'peer hidden',
                        currentValue === RightInputProps.value && activeStyles,
                    )}
                    checked={currentValue === RightInputProps.value}
                />
                {RightInputProps.value}
            </label>
        </div>
    );
}

export default TwoWaySwitch;
