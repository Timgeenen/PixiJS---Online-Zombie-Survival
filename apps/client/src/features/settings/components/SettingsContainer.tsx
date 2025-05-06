import { NavButton } from '@Components';

function SettingsContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/main">Return To Menu</NavButton>
        </div>
    );
}

export default SettingsContainer;
