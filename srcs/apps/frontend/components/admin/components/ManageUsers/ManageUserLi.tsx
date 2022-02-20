import { RefreshIcon } from '@heroicons/react/outline'
import { XCircleIcon, UserAddIcon, UserRemoveIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { addAdmin, banUser, deleteUser, removeAdmin, undoBanUser } from '../../../../app/features/admin'
import { useAppDispatch } from '../../../../app/hooks'
import { useSocket } from '../../../../providers/SocketProvider'

const ManageUserLi = ({user}) => {

	const [banned, setBanned] = useState(user.banned)
	const [admin, setAdmin] = useState(user.type === 'admin');
	const [loading, setLoading] = useState(false)
	const dispatch = useAppDispatch();
	const socket = useSocket();

	const actionUser = (action) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: action == 'delete' ? 'Yes, delete!' : action == 'ban' ? 'Yes, ban!' : 'Yes, unban!',
		  }).then((result) => {
			if (result.isConfirmed) {
			  Swal.fire(
				action == 'delete' ? 'Deleted' : action == 'ban' ? 'ban' : 'unban',
				action == 'delete' ? 'User has been deleted from the website.' : action == 'ban'
				? 'User has been banned from the website.' : 'User has been unbanned from the website.',
				'success'
			  )
			  if (action === 'delete')
			  {
				dispatch(deleteUser({ userId: user.id }))
				.then(() => {
					socket.emit('force_logout', user.id);
				})
				.catch(() => {
					toast.error("Delete user failed");
				})
		
			  }
			  else if (action === 'ban')
			  {
				setBanned(true);
				dispatch(banUser({ userId: user.id }))
				.then(() => {
					socket.emit('force_logout', user.id);
				})
				.catch(() => {
					toast.error("Ban user failed");
				})
			  }
			  else
			  {
				setBanned(false);
				dispatch(undoBanUser({ userId: user.id }))
				.then(() => {
				})
				.catch(() => {
					toast.error("Undo ban user failed");
				})
			  }		  
		
			}
		})
	}

	const adminAction = (action) => {
		if (action === 'add') {
			dispatch(addAdmin({ userId: user.id }))
			setAdmin(true);
		}
		else if (action === 'remove') {
			dispatch(removeAdmin({ userId: user.id }))
			setAdmin(false);

		}
	}

	return (
		<li className="flex items-center py-4 border-b hover:bg-gray-50 rounded-md odd:bg-slate-50 even:bg-white md:text-base text-sm">
			<div className="ml-2 md:w-1/3 w-1/5">
				<h1 className="">{ user.displayName }</h1>
				<div className="hidden md:flex space-x-1 text-sm font-extralight tracking-wide">
					<div className="text-green-500">Email .</div>
					<div>{ user.email }</div>
				</div>
			</div>
			<div className="md:w-2/3 w-4/5 flex text-center items-center">
				<div className="w-1/6">{user.status}</div>
				<div className="w-1/6">{user.type}</div>
				<div className="w-1/6">{ user.enableTwoFactorAuth ? "on" : "off" }</div>
				<div className="w-1/6 flex justify-center">
					<button disabled={loading} onClick={() => actionUser('delete')} className="hidden md:flex items-center bg-red-400 text-white py-1.5 md:px-4 px-2 rounded-lg hover:bg-red-500 ">
						Delete
						{loading && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
					</button>
					<button disabled={loading} onClick={() => actionUser('delete')} className="flex md:hidden items-center">
						<XCircleIcon className="h-7 w-7 text-red-400" />
					</button>
				</div>
				<div className="w-1/6 flex justify-center">
					{!banned ?
						<button disabled={banned} onClick={() => actionUser('ban')} className="flex items-center bg-red-400 text-white py-1.5 md:px-6 px-3 rounded-lg hover:bg-red-500 ">
							Ban
							{banned && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
						</button>
					:	<button disabled={!banned} onClick={() => actionUser('unban')} className="flex items-center bg-sky-400 text-white py-2 md:px-4 px-2 rounded-lg hover:bg-sky-500 ">
							unBan
							{!banned && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
						</button>
					}
					
				</div>
				<div className="w-1/6 flex justify-center">
					{!admin ?
						<div className="">
							<button disabled={admin} onClick={() => adminAction('add')} className="hidden md:flex items-center text-white py-1.5 md:px-6 px-4 rounded-lg bg-sky-400 hover:bg-sky-500">
								Add
								{admin && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
							</button>
							<button disabled={admin} onClick={() => adminAction('add')} className="block md:hidden items-center">
								<UserAddIcon className="h-7 w-7 text-sky-400" />
							</button>
						</div>
					:	<div className="">
							<button disabled={!admin} onClick={() => adminAction('remove')} className="hidden md:flex items-center text-white py-1.5 md:px-4 px-1 rounded-lg bg-red-400 hover:bg-red-500">
								Remove
								{!admin && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
							</button>
							<button disabled={!admin} onClick={() => adminAction('remove')} className="flex md:hidden items-center">
								<UserRemoveIcon className="h-7 w-7 text-red-400" />
							</button>
						</div>
					}
					
				</div>
			</div>
		</li>
	)
}

export default ManageUserLi
