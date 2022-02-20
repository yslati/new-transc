import { Dialog, Transition } from '@headlessui/react';
import { BanIcon } from '@heroicons/react/solid';
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { blockUserUsers } from '../../../app/features/users';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import History from './History';
import InviteGame from './InviteGame';

const UserPage = ({ user, setUserPage }) => {

	const dispatch = useAppDispatch();
	const navigate = useNavigate()

	const auth = useAppSelector(state => state.user)
	const games = useAppSelector(state => state.game.games);

	const [watch, setWatch] = useState(false)
	const [invite, setInvite] = useState(false)
	let winnedGames = games.filter(game => game.winnerId === user.id).length
	
	const handleBlockUser = () => {
		setUserPage(false)
		dispatch(blockUserUsers({ id: user.id }))
	}

	
	useEffect(() => {
		if(watch)
			navigate("/watch", { state: { userId: user.id } })
	}, [watch])

	return (
		<div className="min-h-screen min-w-full px-4 flex justify-center items-center">
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
				<div ref={useRef(null)} className="inline-block w-full h-140 max-w-5xl p-4 items-center transition-all transform bg-white shadow-md shadow-gray-500 rounded-2xl">
					<div className="w-full inline-block overflow-hidden py-4 text-left align-middle transition-all transform  shadow-white shadow rounded-2xl">
						<div className="w-full h-full flex md:flex-row flex-col transform transition-all duration-300">
							<div className="md:w-1/2 w-full flex md:pr-5">
								<div className="items-center">
									<img src={user?.avatar} className="md:mb-4 object-cover object-center w-24 md:w-44 h-24 md:h-44 rounded-full border-2 border-gray-500 shadow-lg" />
									<h2 className="text-xl font-semibold text-center tracking-wider">{user?.displayName}</h2>
									<p className="text-xs">{user?.online}</p>
								</div>
								<div className="ml-auto md:my-0 my-auto">
									{/* {!friend && !requestsent && <button onClick={() => setRequest(true)} className="flex  justify-between shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md w-40 mt-36 md:mt-7 ml-auto" type="button">
										Add friend
										<UserAddIcon className="h-5 w-5 text-white" />
									</button>}
									{!friend && requestsent && <button onClick={() => setRequest(false)} className="flex  justify-between shadow hover:bg-blue-500 bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md w-40 mt-36 md:mt-7 ml-auto" type="button">
										Cancel
										<UserAddIcon className="h-5 w-5 text-white" />
									</button>}
									{friend && <button onClick={() => setfriend(false)} className="flex  justify-between shadow hover:bg-blue-500 bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md w-40 mt-36 md:mt-7 ml-auto" type="button">
										remove
										<UserAddIcon className="h-5 w-5 text-white" />
									</button>} */}
									<button
										onClick={handleBlockUser}
										className="flex items-center justify-between shadow bg-red-500 hover:bg-red-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md md:text-base text-sm md:w-40 w-32 md:mt-7 ml-auto" type="button">
										block
										<BanIcon className="h-5 w-5 text-white" />
									</button>
									{	user.status === 'in game' &&
										auth.user.status !== 'in game' &&
										<button
											onClick={() => setWatch(true)}
											className="flex items-center justify-between shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md md:text-base text-sm md:w-40 w-32 md:mt-7 mt-4 ml-auto" type="button">
											watch Game
										</button>
									}
									{	user.status !== 'in game' &&
										auth.user.status !== 'in game' &&
										<button
											onClick={() => setInvite(true)}
											className="flex items-center justify-between shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md md:text-base text-sm md:w-40 w-32 md:mt-7 mt-4 ml-auto" type="button">
											Invite Game
										</button>
									}
									<Transition appear show={invite} as={Fragment}>
										<Dialog as="div" open={invite} className="fixed inset-0 z-10 overflow-y-auto" onClose={() => setInvite(false)}>
											<InviteGame user={user} setInvite={setInvite} />
										</Dialog>
									</Transition>
								</div>
							</div>
							<div className="md:w-1/2 w-full md:border-l border-gray-400 md:mt-0 mt-5 px-3">
								<div className="w-full flex items-center justify-center space-x-3 py-5">
									<h2 className="text-4xl font-semibold tracking-wider">
										Score:
									</h2>
									<h2 className="text-4xl font-semibold">
										{ user.score }
									</h2>
								</div>
								<div className="w-full">
									<div className="p-2">
										<h2 className="text-center text-lg">Total played</h2>
										<h1 className="text-center font-semibold text-2xl">{games.length}</h1>
									</div>
									<div className="mt-5 flex ">
										<div className="w-1/2 text-center">
											<h3 className="text-green-600">WIN</h3>
											<h1 className="font-semibold text-gray-500 text-3xl">{winnedGames}</h1>
										</div>
										<div className="w-1/2 border-l border-gray-300 text-center ">
											<h3 className="text-red-500">LOSE</h3>
											<h1 className="font-semibold text-gray-500 text-3xl">{games.length - winnedGames}</h1>

										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="md:mt-20 mt-8 border-t border-gray-400 overflow-y-auto md:h-80">
							<History id={user.id} />
						</div>
					</div>
				</div>
			</Transition.Child>
		</div>
		

	)
}

export default UserPage
