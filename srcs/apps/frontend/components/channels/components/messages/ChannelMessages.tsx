import { ChatAltIcon } from '@heroicons/react/outline'
import React, { useEffect } from 'react'
import { fetchChannelMessages } from '../../../../app/features/chat'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import MessagesList from './MessagesList'

const ChannelMessages = () => {

    const dispatch = useAppDispatch();
    const chat = useAppSelector(state => state.chat);
    const auth = useAppSelector(state => state.user.user);
    
    useEffect(() => {
        if (chat.selectedId !== -1)
            dispatch(fetchChannelMessages({ userId: auth.id, channelId: chat.selectedId }));
    }, [chat.selectedId]);

    if (chat.selectedId === -1)
        return (
            <div className="w-full h-full bg-white text-gray-400/20 font-mono flex justify-center items-center border-l-2 border-r-2 select-none">
                <h2 className="font-semibold text-7xl">Channels</h2>
                <ChatAltIcon className="w-32 h-3w-32 ml-3" />
            </div>
        )
    return (
        <div className='flex-1 w-full h-full bg-gray-50'>
            <div className=' flex h-full mx-w-md border-l-2 border-r-2'>
                <MessagesList />
            </div>
        </div>
    )
}

export default ChannelMessages
