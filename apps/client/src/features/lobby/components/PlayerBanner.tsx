import type { ComponentPropsWithRef } from 'react';

interface Props {
    _id: string;
    username: string;
    level: number;
    isReady: boolean;
    isLeader: boolean;
}

function PlayerBanner({
    username,
    _id,
    level,
    isReady,
    isLeader,
    ...props
}: ComponentPropsWithRef<'li'> & Props) {
    return (
        <li {...props} key={_id} id={_id}>
            <span className="text-yellow-600">
                lvl. {level} {'> '}
            </span>
            <span className="text-blue-300">{username}</span>
            {isReady && <span>Ready</span>}
            {isLeader && <span className="text-yellow-300">Leader</span>}
        </li>
    );
}

export default PlayerBanner;
