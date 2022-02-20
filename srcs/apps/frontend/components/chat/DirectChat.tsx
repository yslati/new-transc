import React, { useEffect, useState } from 'react'
import User from './components/User'
import Chat from './components/Chat'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { getFriendsUsers } from '../../app/features/users'
import { ChatIcon } from '@heroicons/react/outline'


const DirectChat = () => {
	const [loading, setLoading] = useState(false);

	const dispatch = useAppDispatch()
	const users = useAppSelector(state => state.users)

	const [index, setIndex] = useState(-1)
	
	useEffect(() => {
		dispatch(getFriendsUsers())
	}, [])

	
	
	return (
		// <div className="h-screen w-screen overflow-hidden">
		<div className="h-screen w-screen flex md:flex-row flex-col bg-white overflow-auto">
			<div className="flex md:flex-col flex-row md:w-2/5 w-full md:border-r-2 border-b-2">
				<div className="md:block hidden border-b-2 py-4 px-2">
					<input type="text" placeholder="search chatting" className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full" />
				</div>
				{
					users.friends.map((friend, i) =>
						<div key={i} onClick={() => setIndex(i)}>
							{users.friends.length && <User user={friend} activeUser={users.friends[index]} />}
						</div>)
				}
			</div>
			<div className="h-full w-full px-5 flex flex-col overflow-auto">
				{
					index !== -1 ?
					<>{users.friends.length && <Chat user={users.friends[index]}  />}</> :
					<div className="w-full h-full bg-white text-gray-400/20 font-mono flex justify-center items-center select-none ">
						<h2 className="font-semibold md:text-7xl text-3xl">Messages</h2>
						<ChatIcon className="md:w-32 md:h-32 w-16 h-16 ml-3" />
					</div>
				}
			</div>
			{
				index !== -1 ?
				<>{
					users.friends.length ? 
					<div className="w-2/5 border-l-2 px-5 md:block hidden">
						<img src={users.friends[index]?.avatar}
							className="object-cover object-center rounded-xl lg:h-64 lg:w-64 mt-10"
						/>
						<div className="font-semibold pt-4">{users.friends[index]?.displayName}</div>
						<div className="font-light">{users.friends[index]?.email}</div>
					</div>
					: <div className="w-2/5 border-l-2 px-5 pt-10 flex justify-center text-lg text-gray-700 font-light"> you dont have friends</div>
				}</> : <></>
			}
				
		</div>
	)
}

export default DirectChat
