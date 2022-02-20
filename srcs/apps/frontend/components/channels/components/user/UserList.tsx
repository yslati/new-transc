import React, { useEffect, useState } from 'react'
import { getUsersBelongsToChannel } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import User from './userLi';

const UserList = () => {

    const dispatch = useAppDispatch();
    
    const { selectedId, users } = useAppSelector(state => state.chat);
    const blockedUsers = useAppSelector(state => state.users.blocked);
    const [filtredUsers, setFiltredUsers] = useState([]);
    const channnel = useAppSelector(state => state.chat.channel);

    useEffect(() => {
        setFiltredUsers(users);
    }, [blockedUsers, users]);

    useEffect(() => {
        if (selectedId !== -1)
            dispatch(getUsersBelongsToChannel({ id: selectedId }))
    }, [selectedId]);


    if (selectedId === -1)
        return <></>

    return (
        <div className='flex flex-col w-64 h-full'>
            <div className='bg-gray-100 w-full flex-1 shadow-md overflow-hidden overflow-y-auto'>
                <ul>
                    {filtredUsers.length ? filtredUsers?.map((user, i) =>
                        <li key={i} >
                            {filtredUsers.length && !user.banned && <User user={user} />}
                        </li>
                    ) : <></>}
                </ul>
            </div>
        </div>
    )
}

export default UserList