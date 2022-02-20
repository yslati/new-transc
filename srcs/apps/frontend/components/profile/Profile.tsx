import React, { useEffect, useState } from 'react'
import { getAllUsers, getFriendsUsers } from '../../app/features/users';
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import FriendList from './components/FriendList';
import History from './components/History';

const Profile = () => {

	const dispatch = useAppDispatch();

    const auth = useAppSelector(state => state.user);
	const usersState = useAppSelector(state => state.users);

	useEffect(() => {
		dispatch(getFriendsUsers());
		dispatch(getAllUsers());		
	}, [usersState.friends.length]);

	return (
		<div className="flex flex-grow lg:flex-row flex-col w-screen  font-mono relative overflow-x-hidden">
			<div className="w-full">
				<div className=" lg:h-100 w-full flex lg:flex-row flex-col lg:p-10 p-5 md:items-start items-center">
					<img src={auth.user.avatar} alt="" className="object-cover object-center w-28 lg:w-64 h-28 lg:h-64 flex-none rounded-full border-2 border-gray-500 shadow-lg"/>
					<div className="w-full lg:ml-14 lg:mt-16 mt-5 md:text-left text-center">
						<h1 className="text-xl font-semibold tracking-wider">@{auth.user.displayName}</h1>
						<h3 className="text-gray-500">{auth.user.email}</h3>
					</div>
				</div>
				<div className="m-6 border-t">
					<History id={auth.user.id} />
				</div>
			</div>
			<div className="lg:w-100 w-full h-full bg-slate-200 lg:overflow-y-auto">
				<h2 className="text-center mb-5 border-b border-gray-300 py-4 mx-3 font-semibold text-gray-700">Friends List</h2>
				{usersState.friends.map(item => <FriendList key={item.id} user={item} /> )}
			</div>
    	</div>
	)
}

export default Profile
