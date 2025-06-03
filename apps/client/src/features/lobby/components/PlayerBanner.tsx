import type { ComponentPropsWithRef } from 'react';

interface Props {
    _id: string;
    username: string;
    level: number;
}

function PlayerBanner({ username, _id, level, ...props }: ComponentPropsWithRef<'li'> & Props) {
    return (
        <li {...props} key={_id} id={_id}>
            <span className="text-yellow-600">
                lvl. {level} {'> '}
            </span>
            <span className="text-blue-300">{username}</span>
        </li>
    );
}

export default PlayerBanner;
