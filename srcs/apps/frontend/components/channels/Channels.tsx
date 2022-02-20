import React, { useEffect } from 'react'
import { fetchAllChannels, getAllChannels, getBanned, getKicked, onOwnerLeaved, updateSocket } from '../../app/features/chat'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import ChannelList from './components/channel/ChannelList'
import ChannelMessages from './components/messages/ChannelMessages'
import UserList from './components/user/UserList'
import { SocketProvider, useSocket } from '../../providers/SocketProvider'

const Chat = () => {

    const dispatch = useAppDispatch();
    const socket = useSocket();
    const userState = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(fetchAllChannels());
        dispatch(updateSocket(socket));
        socket.on('newChannel', () => {
            dispatch(getAllChannels());
        });

        socket.on('owner_leave', (channelId) => {
            dispatch(onOwnerLeaved(channelId));
        });

        socket.on('banned_from_channel', (args) => {
            if (args.userId === userState.user.id) {
                dispatch(getBanned(args.channelId))
            }
        });
        socket.on('kicked_from_channel', (args) => {
            if (args.userId === userState.user.id) {
                dispatch(getKicked(args))
                socket.emit('refresh');
            }
        })

        return () => {
            socket.off('newChannel');
            socket.off('owner_leave');
            socket.off('banned_from_channel');
            socket.off('kicked_from_channel');
        }
    }, []);
    return (
        <div className='h-screen bg-gray-400 flex overflow-auto'>
            <ChannelList />
            <ChannelMessages />
            <UserList />
        </div>
    )
}

export default Chat
