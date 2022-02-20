import { Dialog, Transition } from '@headlessui/react'
import { EmojiHappyIcon, CubeIcon, EmojiSadIcon } from '@heroicons/react/solid'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getGamesHistory } from '../../../app/features/game'
import { useAppSelector } from '../../../app/hooks'
import UserPage from './UserPage'

const FriendList = ({ user }) => {

	const dispatch = useDispatch()
	const auth = useAppSelector(state => state.user.user)
	const [userPage, setUserPage] = useState(false)

	useEffect(() => {
		if (!userPage)
			dispatch(getGamesHistory({ id:auth.id }));
	}, [userPage])

	return (
		<div className="px-3 mt-1 h-14 flex hover:bg-slate-300 rounded-md" onClick={() => setUserPage(true)} >
			<div className="flex items-center cursor-pointer w-full">
				<div className="w-12 h-12 flex-none">
					<img src={user.avatar} alt="" className="object-cover object-center w-12 h-12 rounded-full"/>
					{
						user.status === 'in game' ?
						<CubeIcon className="h-3 w-3 text-blue-400 relative -right-9 bottom-3 bg-gray-300" /> :
						user.status === 'online' ?
						<EmojiHappyIcon className="h-3 w-3 text-green-700 relative -right-9 bottom-3  rounded-full bg-gray-300" /> :
						<EmojiSadIcon className="h-3 w-3 text-yellow-600 relative -right-9 bottom-3 rounded-full bg-gray-300" />
					}
				</div>
				<div className="ml-2 info text-xs flex-auto">
					<div className=" flex space-x-2">
						<h3 className="w-20 truncate">{ user.displayName }</h3>
						<h3 className=" text-cyan-600">Lv { user.level }</h3>
					</div>
					<p className="text-gray-500">{ user.email }</p>
				</div>
			</div>
	
			{/* <button className="ml-auto">
				<ChatAltIcon className="h-5 w-5 text-blue-500 hover:text-cyan-500" />
			</button> */}
			<Transition appear show={userPage} as={Fragment}>
				<Dialog as="div" open={userPage} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setUserPage(false)}>
					<UserPage key={user.id} user={user} setUserPage={setUserPage} />
				</Dialog>
			</Transition>
        </div>
	)
}

export default FriendList
