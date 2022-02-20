import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useState, useEffect } from 'react'
import { Tab } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../../../app/hooks'
import { RefreshIcon } from '@heroicons/react/outline'
import Swal from 'sweetalert2'
import { useDispatch } from 'react-redux'
import { useHooks } from '../../../../hooks/useHooks'
import { addUserChannelRight, deleteUserChannelRight } from '../../../../app/features/admin'
import api from '../../../../services/api';
import { useSocket } from '../../../../providers/SocketProvider'


function classNames(...classes) {
	return classes.filter(Boolean).join(' ')
}

const ManageUsersPopup = ({ channel }) => {

	const [deleteLoading, setDeleteLoading] = useState(false)
	const [addLoading, setAddLoading] = useState(false)
	const dispatch = useAppDispatch();

	const [admins, setAdmins] = useState([]);
	const [users, setUsers] = useState([]);
	const socket = useSocket();

	const getData = async (url) => {
		const res = await api.get(`${url}/${channel.id}`);
		return res.data;
	}

	useEffect(() => {
		getData('/admin/channels/admins').then(data => {
			setAdmins(data);
		});
		getData('/admin/channels/users').then(data => {
			setUsers(data);
		});
	}, []);
	
	const removeRole = (channelId: number, userId: number) => {
		Swal.fire({
			title: 'Are you sure?',
			text: "you want to remove rights for this user!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, remove rights!'
			}).then(async (result) => {
			if (result.isConfirmed) {
				Swal.fire(
				'Removed!',
				'User rights has been removed.',
				'success'
				)
				// setDeleteLoading(true)
				dispatch(deleteUserChannelRight({ channelId, userId }))
				.then(() => {
					socket.emit('refresh');
				})
				.catch(() => {})
				await getData('/admin/channels/admins').then(data => {
					setAdmins(data);
				});
				await getData('/admin/channels/users').then(data => {
					setUsers(data);
				})
			}
		})
	}

	const addRole = async (channelId: number, userId: number) => {
		// setAddLoading(true)
		dispatch(addUserChannelRight({ channelId, userId }))
			.then(() => {
				socket.emit('refresh');
			})
			.catch(() => {})
		// admins = useHooks(channel, '/admin/channels/admins');
		await getData('/admin/channels/admins').then(data => {
			setAdmins(data);
		});
		await getData('/admin/channels/users').then(data => {
			setUsers(data);
		})
	}

	return (
		<div className="min-h-screen px-4 text-center">
			<Transition.Child
			as={Fragment}
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
			>
				<Dialog.Overlay className="fixed inset-0 bg-black/20" />
			</Transition.Child>
			<span className="inline-block h-screen align-middle" aria-hidden="true" >
				&#8203;
			</span>
			<Transition.Child
				as={Fragment}
				enter="ease-out duration-300"
				enterFrom="opacity-0 scale-95"
				enterTo="opacity-100 scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 scale-100"
				leaveTo="opacity-0 scale-95"
				>
				<div ref={useRef(null)} className="inline-block w-full max-w-md p-6 align-middle transition-all transform bg-white shadow-md shadow-gray-500 rounded-2xl">
					<div className="w-full h-96 max-w-md px-2 sm:px-0">
						<Tab.Group>
							<Tab.List className="flex p-1 space-x-1 bg-gray-700/20 rounded-xl">
								<Tab key={0} className={({ selected }) =>
									classNames(
									'w-full py-2.5 text-sm font-medium text-blue-700 rounded-lg',
									'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
									selected
										? 'bg-white shadow'
										: 'text-blue-50 hover:bg-white/[0.15] hover:text-white'
									)
								}
								>
								Admins
								</Tab>
								<Tab key={1} className={({ selected }) =>
									classNames(
									'w-full py-2.5 text-sm font-medium text-blue-700 rounded-lg',
									'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
									selected
										? 'bg-white shadow'
										: 'text-blue-50 hover:bg-white/[0.15] hover:text-white'
									)
								}
								>
								Add Admin
								</Tab>

							</Tab.List>
							<Tab.Panels className="mt-2">
								<Tab.Panel key={0} >
									<ul className="h-80 mt-4 overflow-y-scroll scrollbar-hide">
										{ admins.length ? admins.map((admin, index) => (
												<li key={index} className="flex py-3 px-4 rounded-md items-center justify-between border-b hover:bg-gray-50" >
													<h3 className=" font-medium tracking-wider"> {admin.displayName} </h3>
													<button disabled={deleteLoading} onClick={() => removeRole(channel.id, admin.id)} className="flex items-center bg-red-400 hover:bg-red-500 text-white text-sm py-2 px-4 rounded-lg">
															Remove
														{deleteLoading && <RefreshIcon className="ml-3 h-5 w-5 animate-spin" /> }
													</button>
												</li>
											)) : <h2>Empty</h2>
										}
									</ul>
								</Tab.Panel>

								<Tab.Panel key={1} >
									<ul className="h-80 mb-4 overflow-y-scroll scrollbar-hide">
										{
											users.length ?
											users.map((user, index) => (
												<li key={index} className="flex py-3 px-4 rounded-md items-center justify-between border-b hover:bg-gray-50" >
													<h3 className=" font-medium tracking-wider"> {user.displayName} </h3>
													<button disabled={addLoading} onClick={() => addRole(channel.id, user.id)} className="flex items-center bg-teal-400 hover:bg-teal-500 text-white text-sm py-2 px-4 rounded-lg">
															Add
														{addLoading && <RefreshIcon className="ml-3 h-5 w-5 animate-spin" /> }
													</button>
												</li>
											) ) : <h2>Empty</h2>
										}
									</ul>
								</Tab.Panel>
							</Tab.Panels>
							<input className="w-0 h-0" />
						</Tab.Group>
					</div>
				</div>
			</Transition.Child>
		</div>
	)
}

export default ManageUsersPopup
