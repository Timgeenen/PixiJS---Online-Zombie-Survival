import { NavButton } from '@Components';

function MyProfileContainer() {
    return (
        <div className="flex flex-col gap-2">
            <NavButton path="/main">Return To Menu</NavButton>
        </div>
    );
}

export default MyProfileContainer;
