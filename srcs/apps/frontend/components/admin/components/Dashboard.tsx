import React, { useEffect } from 'react'
import { getAllChannels, getAllUsers } from '../../../app/features/admin'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import ChannelLi from './Dashboard/ChannelLi'
import UserLi from './Dashboard/UserLi'

const Dashboard = () => {

	const dispatch = useAppDispatch()
	const admin = useAppSelector(state => state.admin)

	useEffect(() => {
		dispatch(getAllUsers())
		dispatch(getAllChannels())
	}, [])

	let onlineUsers = admin.users.filter((user) => user.status !== 'offline')
	let bannedUsers = admin.users.filter((user) => user.banned)

	return (
		<div className="w-full max-w-5xl py-5 overflow-x-hidden">
			<h1 className="font-extralight text-4xl text-gray-800 mt-10 ">Dashboard</h1>
			<div className="w-full flex mt-10 justify-between space-x-5 tracking-wide">
				<div className="bg-gray-100 flex flex-col hover:bg-gray-200 p-3 w-1/4 lg:w-52 md:w-40 rounded-xl">
					<h2 className="font-extralight text-gray-700 md:text-xl text-sm text-left mb-2">Users</h2>
					<h1 className="text-blue-500 font-medium md:mt-0 mt-auto text-5xl text-center">{ admin.users.length }</h1>
				</div>
				<div className="bg-gray-100 flex flex-col hover:bg-gray-200 p-3 w-1/4 lg:w-52 md:w-40 rounded-xl">
					<h2 className="font-extralight text-gray-700 md:text-xl text-sm text-left mb-2">Channels</h2>
					<h1 className="text-green-500 font-medium md:mt-0 mt-auto text-5xl text-center">{ admin.channels.length }</h1>
				</div>
				<div className="bg-gray-100 flex flex-col hover:bg-gray-200 p-3 w-1/4 lg:w-52 md:w-40 rounded-xl">
					<h2 className="font-extralight text-gray-700 md:text-xl text-sm text-left mb-2">Active users</h2>
					<h1 className="text-yellow-500 font-medium md:mt-0 mt-auto text-5xl text-center">{ onlineUsers.length }</h1>
				</div>
				<div className="bg-gray-100 flex flex-col hover:bg-gray-200 p-3 w-1/4 lg:w-52 md:w-40 rounded-xl">
					<h2 className="font-extralight text-gray-700 md:text-xl text-sm text-left mb-2">Banned users</h2>
					<h1 className="text-red-500 font-medium md:mt-0 mt-auto text-5xl text-center">{ bannedUsers.length }</h1>
				</div>
			</div>

			<div className="mt-10 w-full">
				<ul className="mb-1 ">
					<li className="flex items-center py-4 border-b text-gray-400 text-sm font-light">
						<div className="ml-2 md:w-1/2 w-1/4"> All users</div>
						<div className="md:w-1/2 w-3/4 flex text-center items-center">
							<div className="w-1/4"> Nº Friends</div>
							<div className="w-1/4"> Type </div>
							<div className="w-1/4"> 2FA </div>
							<div className="w-1/4"> Banned </div>
						</div>
					</li>
					<div className="h-96 overflow-y-auto">
						{
							admin.users.map((user, index) => <UserLi key={index} user={user} />)
						}
						
					</div>
				</ul>
			</div>

			<div className="mt-10 w-96 max-w-md">
				<ul className="mb-1 ">
					<li className="flex items-center py-3 border-b text-gray-400 text-sm font-light">
						<div className="ml-2 md:w-1/2 w-1/3"> All channels</div>
						<div className="md:w-1/2 w-2/3 flex text-center">
							<div className="w-1/2"> Nº members</div>
							<div className="w-1/2"> Type </div>
						</div>
					</li>
					<div className="h-52 overflow-y-auto">
						{
							admin.channels.map((channel, index) => <ChannelLi key={index} channel={channel} />)
						}
						
						
					</div>
				</ul>
			</div>
		</div>
	)
}

export default Dashboard
