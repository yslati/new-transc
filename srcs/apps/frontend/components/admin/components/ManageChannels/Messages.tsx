import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import React from 'react'
import { useEffect } from 'react';
import { fetchAllChannelMessages } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';



const Messages = ({ channel }) => {

    const dispatch = useAppDispatch();

    const { messages } = useAppSelector(state => state.chat);

    useEffect(() => {
        channel.id !== -1 && dispatch(fetchAllChannelMessages({ channelId: channel.id }));
    }, []);

    return (
        <div className='h-full w-full flex flex-col overflow-hidden overflow-y-auto '>
            { messages.length ? 
                messages.map((msg) => 
                <div key={msg.id} className='mt-2 py-1 w-full'>
                    <div className="h-8 items-center flex">
                        <img className='h-9 w-9 rounded-full' src={msg.user?.avatar} alt="user" />
                        <span className="text-clack ml-2 font-bold">{msg.user?.displayName}</span>
                    </div>
                    <p className="ml-10 pl-1 text-left pr-2">{msg.body}</p>
                </div>
            ) :
                <div className="w-full h-full flex justify-center items-center space-x-2 select-none cursor-help">
                    <h2 className="text-3xl font-semibold text-gray-300">No Messages</h2>
                    <QuestionMarkCircleIcon className="w-10 h-10 text-gray-300" />
                </div>
            }
            <input className="w-0 h-0" />
        </div>
    )
}

export default Messages
