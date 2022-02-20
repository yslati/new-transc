import { ChevronRightIcon, PlusSmIcon } from '@heroicons/react/outline';
import { EyeOffIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react'
import { getAllChannels, getUsersBelongsToChannel, selectedChannel } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import AddChannel from './AddChannel';
import JoinChannel from './JoinChannel';

const ChannelList = () => {

    const dispatch = useAppDispatch();

    const { allChannels, channels, selectedId } = useAppSelector(state => state.chat);
    const auth = useAppSelector(state => state.user);
    
    const [clickJoin, setClickJoin] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const refresh = useAppSelector(state => state.global.refresh);

    const handleJoinChannel = (channel) => {
        setClickJoin(channel);
        setIsOpen(true);
    }
    
    const handleJoinedChannel = (id: number) => {
        dispatch(selectedChannel(id));
        if (selectedId !== -1)
            dispatch(getUsersBelongsToChannel({ id: selectedId }))
    }

    useEffect(() => {
        dispatch(getAllChannels());
        if (selectedId !== -1)
            handleJoinedChannel(selectedId);
    }, [refresh]);
    
    return (
        <div className='flex flex-col w-64 h-full'>
            { clickJoin &&
                <JoinChannel setIsOpen={setIsOpen} isOpen={isOpen} channel={clickJoin} />
            }
            <div className='bg-gray-100 w-64 overflow-hidden overflow-y-auto flex-1'>
                <ul className="">
                    <div className="ml-2 mt-2 font-medium">Available Channels</div>
                    { allChannels.map(channel => {
                        if (channel.ownerId === auth.user.id)
                            return <span key={channel.id}></span>
                        return (
                            <li key={channel.id} onClick={() => handleJoinChannel(channel)}
                                className='p-2 px-4 border-b hover:bg-gray-100 cursor-pointer flex justify-between'
                            >
                            <div className="text-gray-900 tracking-wider">
                                { channel.name }
                            </div>
                            { channel.type === "private" ?
                                <EyeOffIcon className="h-5 w-6 text-gray-600 " /> :
                                <PlusSmIcon className="h-6 w-6 text-gray-600" />
                            }
                            </li>
                        )
                    })}
                </ul>
                <div className="border my-3"></div>
                <ul className="">
                    <div className="ml-2 font-medium">Joined Channel</div>
                    { channels.map(channel => (
                        <li key={channel.id} onClick={() => handleJoinedChannel(channel.id)}
                        className={selectedId != channel.id ? 
                            'p-2 px-4 border-b hover:bg-gray-100 cursor-pointer flex justify-between' :
                            'p-2 px-4 border-b hover:bg-gray-100 cursor-pointer flex justify-between bg-blue-100'
                        }>
                            <div className="text-gray-900 tracking-wider flex items-center w-full">
                                { channel.name }
                                {selectedId == channel.id && <ChevronRightIcon className="h-4 w-4 ml-auto text-gray-500" />}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <AddChannel />
        </div>
    )
}

export default ChannelList
