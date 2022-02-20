import React, { useEffect } from 'react'
import { getAllUsers, getPendingUsers } from '../../app/features/users'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import UserCard from './components/UserCard'


const Users = () => {

	const usersState = useAppSelector(state => state.users);
	const dispatch = useAppDispatch();

	useEffect(() => {
		dispatch(getAllUsers());
		dispatch(getPendingUsers());
	}, [usersState.users.length]);

	return (
		<div className="w-screen h-screen p-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
			{ usersState.users.length ?
				usersState?.users?.map(user =>  <UserCard key={user.id} user={user} /> )
				: <div className="text-xl font-light text-gray-700">No users</div>
			}
		</div>
	)
}

export default Users
