import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/outline'
import { UserIcon } from '@heroicons/react/solid'
import React from 'react'
import { acceptFriendRequest, cancelInvitation } from '../../../app/features/users'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'


const AddFriend = ({ user }) => {

	const dispatch = useAppDispatch()

	const usersState = useAppSelector(state => state.users);

	const acceptRequest = () => {
		dispatch(acceptFriendRequest({ id:user.id }))
	}

	const cancelRequest = () => {
		dispatch(cancelInvitation({ id:user.id }))
	}
	return (
		<div className="h-16 flex items-center mx-3">
            <div className="w-12 h-12 flex-none relative">
                <img src={user.avatar} alt="" className="object-cover object-center w-12 h-12 rounded-full"/>
				<UserIcon className="h-4 w-4 p-0.5 bg-blue-600  absolute right-0 bottom-0 rounded-full text-white" />
            </div>
            <div className="ml-2 info text-xs flex-auto">
                <h3 className="w-32 truncate font-semibold text-sm text-white">{ user.username }</h3>
                <p className="text-gray-400"> sent you a friend request.</p>
            </div>
			<div className="ml-auto flex space-x-3">
				<button onClick={acceptRequest} className="">
					<CheckCircleIcon className="h-6 w-6 text-blue-600" />
				</button>
				<button className="" onClick={cancelRequest}>
					<XCircleIcon className="h-6 w-6 text-red-500" />
				</button>
			</div>
        </div>
	)
}

export default AddFriend