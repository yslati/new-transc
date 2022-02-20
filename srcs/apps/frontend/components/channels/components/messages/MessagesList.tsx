import React, { useState } from 'react'
import { useEffect } from 'react';
import { useRef } from 'react'
import toast from 'react-hot-toast';
import { addMessage, fetchChannelMessages } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useSocket } from '../../../../providers/SocketProvider';
import Message from './Message'

const MessagesList = () => {

    const dispatch = useAppDispatch();
    const socket = useSocket();
    const areaRef = useRef(null);

    const { messages, users, selectedId } = useAppSelector(state => state.chat);
    const auth = useAppSelector(state => state.user.user);
    const me = users.filter((user) => user.user.id === auth.id)[0]


    
    const [message, setMessage] = useState('');
    
    const scrollToBottom = () => {
        areaRef.current.scrollIntoView({ behavior: "smooth" })
    }

    
    const handleMessage = (e) => {
        e.preventDefault();
        if (me.mutted) return toast.error('you are mutted');
        if (message.trim().length === 0) return;
        socket.emit('send', {
            id: selectedId,
            message: message,
            user: auth
        })
        setMessage('');
    }

    useEffect(() => {
        
        socket.on('message', (msg) => {
            dispatch(addMessage(msg))
            scrollToBottom();
        })
        selectedId !== -1 && dispatch(fetchChannelMessages({ userId: auth.id ,channelId: selectedId }));
        return () => {
            socket.off('message')
        }
    }, []);

    return (
        <div className='h-full flex-1 flex flex-col'>
            <div className='bg-gray-200 flex-1 w-full px-4 py-2 overflow-hidden overflow-y-auto'>
                { messages.map((msg, index) => 
                    <Message key={index} msg={msg.body} avatar={msg.avatar} displayName={msg.displayName} userId={msg.id} />
                )}
            </div>
                <div ref={areaRef} />
            
            <div className='bg-gray-200 p-4'>
                <form onSubmit={handleMessage}>
                    { users.length && !me?.mutted ?
                        <input type="text"
                        className='w-full p-3 rounded-md bg-gray-300'
                        onChange={(e) => setMessage(e.target.value)}
                        value={message} placeholder='Your message'
                        /> :
                        <input type="text" disabled
                        className='w-full p-3 rounded-md bg-gray-300'
                        onChange={(e) => setMessage(e.target.value)}
                        value={message} placeholder='You are mutted'
                        />
                    }
                </form>
            </div>
        </div>
    )
}

export default MessagesList
