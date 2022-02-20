import { Dialog, Transition } from '@headlessui/react'
import { RefreshIcon } from '@heroicons/react/outline'
import { XCircleIcon, AdjustmentsIcon, ChatAlt2Icon } from '@heroicons/react/solid'
import React, { Fragment, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import Swal from 'sweetalert2'
import { deleteChannel } from '../../../../app/features/admin'
import { useAppDispatch } from '../../../../app/hooks'
import { useHooks } from '../../../../hooks/useHooks'
import { useSocket } from '../../../../providers/SocketProvider'
import ManageUsersPopup from './ManageUsersPopup'
import ViewMessages from './ViewMessages'

const ManageChannelLi = ({ channel }) => {

	const dispatch = useAppDispatch()

	const [Manageusers, setManageUsers] = useState(false)
	const [Messages, setMessages] = useState(false)
	const [loading, setLoading] = useState(false)
	const [members] = useHooks(channel, '/admin/channels');
	const socket = useSocket();

	const DeleteChannel = () => {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					'Deleted!',
					'channel has been deleted.',
					'success'
				);
				setLoading(true);
				dispatch(deleteChannel({ channelId: channel.id }))
					.then(() => {
						socket.emit('owner_leave', channel.id);
					})
					.catch(() => {
						toast.error('Failed to delete this channel');
					});
				setLoading(false);
			}
		})
	}
	return (
		<li className="flex md:text-base text-sm items-center py-3 border-b hover:bg-gray-50 rounded-md odd:bg-slate-50 even:bg-white max-w-3xl">
			<div className="ml-2 md:w-1/4 w-1/5 items-center">{channel.name}</div>
			<div className="md:w-3/4 w-4/5 flex text-center items-center">
				<div className="w-1/5">{members.length}</div>
				<div className="w-1/5">{channel.type}</div>
				<div className="w-1/5 flex justify-center cursor-pointer">
					<button onClick={() => setMessages(true)} className="md:block hidden bg-sky-400 hover:bg-sky-500 text-white md:py-2 py-1.5 md:px-4 px-2 rounded-lg">View</button>
					<button onClick={() => setMessages(true)} className="md:hidden flex">
						<ChatAlt2Icon className="h-7 w-7 text-sky-400" />
					</button>
				</div>
				<div className="w-1/5 flex justify-center cursor-pointer">
					<button onClick={() => setManageUsers(true)} className="md:block hidden bg-sky-400 hover:bg-sky-500 text-white md:py-2 py-1.5 md:px-4 px-2 rounded-lg">Manage</button>
					<button onClick={() => setManageUsers(true)} className="md:hidden flex">
						<AdjustmentsIcon className="h-7 w-7 text-sky-400" />
					</button>
				</div>
				<div className="w-1/5 flex justify-center cursor-pointer">
					<button disabled={loading} onClick={DeleteChannel} className="md:flex hidden items-center bg-red-400 hover:bg-red-500 text-white md:py-2 py-1.5 md:px-4 px-2 rounded-lg">
						Delete
						{loading && <RefreshIcon className="ml-1 h-5 w-5 animate-spin" />}
					</button>
					<button disabled={loading} onClick={DeleteChannel} className="md:hidden flex items-center">
						<XCircleIcon className="h-7 w-7 text-red-400" />
					</button>
				</div>
			</div>
			<Transition appear show={Manageusers} as={Fragment}>
				<Dialog as="div" open={Manageusers} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setManageUsers(false)}>
					<ManageUsersPopup channel={channel} />
				</Dialog>
			</Transition>
			<Transition appear show={Messages} as={Fragment}>
				<Dialog as="div" open={Messages} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setMessages(false)}>
					<ViewMessages channel={channel} />
				</Dialog>
			</Transition>
		</li>
	)
}

export default ManageChannelLi
