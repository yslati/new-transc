import React, { useEffect } from 'react'
import { getPendingUsers } from '../../../app/features/users'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import AddFriend from './addFriend'

const Notification = () => {
	
	const dispatch = useAppDispatch();
	
	const usersState = useAppSelector(state => state.users);

	useEffect(() => {
		dispatch(getPendingUsers());
	}, []);

	return (
		<div className="font-mono w-60 md:w-96 md:h-60 bg-gray-800 rounded-lg shadow-sm shadow-white overflow-y-auto">
			<div className="flex justify-between px-4 py-2">
				<h3 className="select-none text-white font-semibold tracking-wider">Friends requests</h3>
				{/* <button className="text-blue-600">
					See all
				</button> */}
			</div>
			<div className="h-48 md:overflow-y-auto">
				{usersState.pending.map(item => <AddFriend key={item.id} user={item} />)}
			</div>
		</div>
	)
}

export default Notification