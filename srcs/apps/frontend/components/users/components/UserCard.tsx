import React, { useState } from 'react'
import { blockUserUsers, getPendingUsers, sendFriendRequest } from '../../../app/features/users';
import { useAppDispatch } from '../../../app/hooks';
import { useSocket } from '../../../providers/SocketProvider';

const UserCard = ({ user }: { user: any}) => {

	const dispatch = useAppDispatch();

	const socket = useSocket();

	const handleSendRequest = () => {
		dispatch(sendFriendRequest({ id: user.id }));
		dispatch(getPendingUsers());
		socket.emit('refresh');
	}

	const handleBlockUser = () => {
		dispatch(blockUserUsers({ id: user.id }));
		socket.emit('refresh');
	}

	return (
		<div className="font-mono bg-gray-900 w-60 h-96 rounded overflow-hidden shadow-xl flex flex-col mb-10">
			<img src={user.avatar} className="w-full h-56 object-cover object-center "/>
			<h3 className="px-3 mt-3 font-bold text-yellow-300 text-xl">
				{ user.displayName }
			</h3>

			<div className="w-full flex flex-col mt-auto px-3 transition-all">
				<button onClick={handleSendRequest} className="w-full text-center inline-block text-black rounded-md px-3 py-2 text-sm font-semibold bg-yellow-200 hover:bg-yellow-300 mr-2 mb-2">
					Add Friend
				</button>
				<button onClick={handleBlockUser} className="w-full text-center inline-block text-gray-200 rounded-md px-3 py-2 text-sm font-semibold bg-gray-500 hover:bg-gray-700 mr-2 mb-2">
					Block
				</button>
			</div>
		</div>
	)
}

export default UserCard
