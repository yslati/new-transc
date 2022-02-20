import { Dialog, Transition } from '@headlessui/react'
import { DotsVerticalIcon } from '@heroicons/react/outline'
import { PlayIcon } from '@heroicons/react/solid'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../../../app/hooks'
import { useSocket } from '../../../../providers/SocketProvider'
import InviteGame from '../../../profile/components/InviteGame'
import ManageUsersPopup from './ManageUsersPopup'

const Protected = ({ children, user }) => {
	const auth = useAppSelector(state => state.user)
	const { users } = useAppSelector(state => state.chat)
	const chat = useAppSelector(state => state.chat)

	if (chat?.channel?.ownerId === auth.user.id || auth.user.id === user.user.id ||
		chat?.channel?.channelUsers?.filter((user) => user.type === 'owner')[0]?.user?.id === auth.user.id)
		return <> {children} </>

	if (users?.filter((usr) => usr.type === 'admin' && usr.user.id === auth.user.id).length && (user.type === 'admin' || user.type === 'normal'))
		return <> {children} </>

	return <></>
}

const User = ({ user }) => {

	const navigate = useNavigate()
	const auth = useAppSelector(state => state.user)

	const [Manageusers, setManageUsers] = useState(false)
	const [invite, setInvite] = useState(false)

	const userRef = useRef(null)
	const inviteRef = useRef(null)

	const blockedUsers = useAppSelector(state => state.users.blocked);

	const canInvite = (userId: number) => {
			if (blockedUsers.find(tmp => tmp.id === userId)) {
				return false;
			}
			return true;
	}

	const toProfile = () => {
		user.user.id === auth.user.id ?
		navigate(`/profile`) :
		navigate(`/user/${user.user.id}`)
	}

	return (
		<div className="flex flex-row py-2 px-2 items-center border-b-2 hover:bg-gray-100 select-none">	
			<img src={user.user.avatar} onClick={() => toProfile()}
				className="object-cover object-center h-12 w-12 rounded-full cursor-pointer hover:brightness-90"
			/>
			<div className="ml-2 select-none w-16">
				<div className="text-base font-semibold cursor-pointer hover: text-gray-700" onClick={() => toProfile()}>{user.user.displayName}</div>
				<span className="text-sm text-gray-500">{user.type === 'normal' ? 'user' : user.type}</span>
			</div>
			{	user.user.id !== auth.user.id && user.user.status !== 'offline' && canInvite(user.user.id) &&
				<PlayIcon onClick={() => setInvite(true)} className="cursor-pointer h-7 w-7 text-lime-700 hover:text-lime-500 active:text-lime-600 ml-12" />
			}

			<Protected user={user}>
				<DotsVerticalIcon onClick={() => setManageUsers(true)} className="cursor-pointer h-8 w-8 p-1.5 ml-auto text-gray-500 hover:bg-slate-200 active:bg-gray-300 active:text-gray-50 rounded-full" />
			</Protected>
		
	
			<Transition appear show={Manageusers} as={Fragment}>
				<Dialog as="div" initialFocus={userRef} open={Manageusers} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setManageUsers(false)}>
					<ManageUsersPopup user={user} closePopup={setManageUsers} />
				</Dialog>
			</Transition>

			<Transition appear show={invite} as={Fragment}>
				<Dialog as="div" initialFocus={inviteRef} open={invite} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setInvite(false)}>
					<InviteGame user={user.user} setInvite={setInvite} />
				</Dialog>
			</Transition>

		</div>
	)
}

export default User