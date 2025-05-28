import Button from './Button';

interface Props {
    nextButtonProps?: React.HtmlHTMLAttributes<HTMLButtonElement>;
    prevButtonProps?: React.HtmlHTMLAttributes<HTMLButtonElement>;
    currentValue: string | number;
}

function ValueSwitcher({ nextButtonProps, prevButtonProps, currentValue }: Props) {
    return (
        <div>
            {prevButtonProps && <Button {...prevButtonProps} />}
            {currentValue}
            {nextButtonProps && <Button {...nextButtonProps} />}
        </div>
    );
}

export default ValueSwitcher;
