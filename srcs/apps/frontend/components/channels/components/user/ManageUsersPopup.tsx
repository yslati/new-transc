import { Dialog, Transition } from '@headlessui/react'
import { LogoutIcon, RefreshIcon } from '@heroicons/react/outline';
import React, { Fragment, useRef, useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getAllChannels } from '../../../../app/features/admin';
import { addAdminChannel, getUsersBelongsToChannel, kickUser, muteUserInChannel, removeAdminChannel, unMuteUserInChannel, updateChannelVisibility } from '../../../../app/features/chat';
import { banUser, leaveChannel } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';
import { useSocket } from '../../../../providers/SocketProvider';

const ManageUsersPopup = ({ user, closePopup }) => {

	const dispatch = useAppDispatch();
	const auth = useAppSelector(state => state.user)
	const { selectedId, channel } = useAppSelector(state => state.chat)

	const [mute, setMute] = useState(user.mutted)
	const [admin, setAdmin] = useState(user.type)
	const [banned, setBanned] = useState(user.banned)
	const [changed, setChanged] = useState(false)
	const [visibility, setVisibility] = useState(channel.type)
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const socket = useSocket();
	const refresh = useAppSelector(state => state.global.refresh);


	const handleSave = () => {
		setLoading(true)
		if (mute !== user.mutted) {
			mute ?
			dispatch(muteUserInChannel({ channelId: selectedId, userId: user.user.id })) :
			dispatch(unMuteUserInChannel({ channelId: selectedId, userId: user.user.id }))
			setLoading(false)
		}
		if (admin !== user.type) {
			admin === 'admin' ?
			dispatch(addAdminChannel({ channelId: selectedId, userId: user.user.id })) :
			dispatch(removeAdminChannel({ channelId: selectedId, userId: user.user.id }))
			setLoading(false)
		}
		closePopup(false)
		socket.emit('refresh');
	}

	const handleBan = () => {
		setBanned(true)
		dispatch(banUser({ channelId: selectedId, userId: user.user.id }))
		setBanned(false)
		closePopup(false)
	}

	const handleLeave = () => {
        dispatch(leaveChannel({ id: selectedId }))
    }

	const handlekickUser = () => {
		dispatch(kickUser({ channelId: selectedId, userId: user.user.id }))
	}

	const updateChannel = () => {
		if (visibility === 'public') {
			dispatch(updateChannelVisibility({ id:selectedId, data: { type: visibility } }))
			.then((res) => {
				socket.emit('refresh')
			})
			.catch(() => {

			})

		}
		else if (visibility === 'private') {
			if (password.trim().length >= 4 && password.trim().length <= 10) {
				dispatch(updateChannelVisibility({ id:selectedId, data: { type: visibility, password } }))
				.unwrap()
				.then((res) => {
					socket.emit('refresh')
				})
				.catch(() => {

				})
			}
		}
	}


	useEffect(() => {
		if (mute !== user.mutted) {
			setChanged(true)
		}
		if (admin !== user.type) {
			setChanged(true)
		}
		if (mute === user.mutted && admin === user.type)
			setChanged(false)
	}, [mute, admin]);

	useEffect(() => {
	}, [])

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
				<div ref={useRef(null)} className="inline-block w-full max-w-sm p-6 align-middle transition-all transform bg-white shadow-md shadow-gray-500 rounded-2xl">
					<div className="w-full h-96 max-w-md px-2 sm:px-0 select-none flex flex-col">
						<div className=" font-semibold text-gray-700 mb-4">Options</div>
						{ user.user.id === auth.user.id && user.type === 'owner' &&
							<div className="w-full flex flex-col">
								<select defaultValue={visibility} onChange={(e) => setVisibility(e.target.value)} className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
									<option value='public'>public</option>
									<option value="private">private</option>
								</select>
								{ visibility === "private" &&
									<input  type="password" placeholder='Password'
									value={password} required minLength={4} maxLength={10}
									onChange={(e) => setPassword(e.target.value)}
									className='border mt-2 border-gray-400 p-2 rounded-md shadow-md w-full' />
								}
								<button onClick={updateChannel} className="py-2 px-4 text-white bg-blue-400 rounded-lg mt-5 w-28 ml-auto">
									update
								</button>
							</div>
						}
						{ ((user.user.id !== auth.user.id && user.type !== 'owner') )  && // user  mute user
							<label className="inline-flex items-center w-full justify-between hover:bg-gray-200 p-3 rounded-2xl text-gray-600 mb-2 cursor-pointer">
								<span className="ml-2">Mute</span>
								<input disabled={user.type === 'owner'} onChange={() => setMute(!mute)} type="checkbox" className="form-checkbox h-4 w-4 text-red-400" checked={mute} />
							</label>
						}
						{ user.user.id !== auth.user.id &&
							<label className="inline-flex items-center w-full justify-between hover:bg-gray-200 p-3 rounded-2xl text-gray-600 mb-2 cursor-pointer">
								<span className="ml-2">admin</span>
								<input disabled={user.type === 'owner'} onChange={() => setAdmin(admin === 'admin' ? 'normal' : 'admin')} type="checkbox" className="form-checkbox h-4 w-4 text-red-400" checked={admin === 'admin'} />
							</label>
						}
						{ user.user.id !== auth.user.id && user.type !== 'owner' &&
							<div className="flex w-full justify-around">
								<button disabled={banned} onClick={handleBan} className="justify-center flex items-center bg-red-400 text-white py-1.5 px-8 rounded-lg hover:bg-red-500 m-2">
									Ban
									{banned && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
								</button>
								<button disabled={banned} onClick={handlekickUser} className="justify-center flex items-center bg-amber-500 text-white py-1.5 px-8 rounded-lg hover:bg-amber-400 m-2">
									kick
									{banned && <RefreshIcon className="ml-2 h-5 w-5 animate-spin" /> }
								</button>
							</div>
						}
						{ user.user.id === auth.user.id &&
							<div onClick={handleLeave} className="flex text-red-400 font-medium tracking-wider items-center mt-auto ml-auto p-2 active:bg-red-200 active:text-red-600 hover:bg-red-100 rounded-xl cursor-pointer">
								Leave
								<LogoutIcon className="w-5 h-5 ml-3" />
							</div>
						}
						{ (changed === true && user.user.id !== auth.user.id) &&
							<button onClick={handleSave} className="text-blue-500 bg-blue-200 font-medium tracking-wider items-center mt-auto ml-auto py-2 px-4 active:bg-blue-200 active:text-blue-600 hover:bg-blue-100 rounded-xl cursor-pointer">
								save
							</button>
						}
						<input className="w-0 h-0" />
					</div>
				</div>
			</Transition.Child>
		</div>
	)
}

export default ManageUsersPopup
