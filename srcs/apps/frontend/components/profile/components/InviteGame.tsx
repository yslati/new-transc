import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import { useSocket } from '../../../providers/SocketProvider'

const InviteGame = ({ user, setInvite }) => {

	const socket = useSocket();
	const navigate = useNavigate()

	const [watch, setWatch] = useState(false)

	const invite = (type: string)=>{
		socket.emit('invite_to', {
			gameType: type,
			userId: user.id
		});
		setInvite(false);
	}

	useEffect(() => {
		if(watch)
			navigate("/watch", { state: { userId: user.id } })
	}, [watch])

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
					<div className="w-full max-w-md">
						{user.status == 'online' &&
							<div className='flex flex-col h-full mx-w-md px-5'>
								<h2 className="text-center mx-auto text-xl font-semibold text-gray-600 tracking-wide">
									Type of Game
								</h2>
								<div className='flex'>
									<button id="btn_join" className="game-btn"
										onClick={()=>invite('dual')}
									>
										Dual Pong
									</button>
									<button id="btn_join" className="game-btn"
										onClick={()=>invite('triple')}
									>
										Triple Pong
									</button>
								</div>
							</div>
						}
						{user.status == 'in game' &&
							<div className='flex flex-col h-full mx-w-md px-5'>
								<h2 className="text-center mx-auto text-xl font-semibold text-gray-600 tracking-wide">
									Watch The Game
								</h2>
								<button
									onClick={() => setWatch(true)}
									className="mx-auto items-center shadow bg-blue-400 hover:bg-blue-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md md:text-base text-sm md:w-40 w-32 md:mt-7 mt-4 ml-auto" type="button">
									watch Game
								</button>
							</div>
						}
					</div>
				</div>
			</Transition.Child>
		</div>
  )
}

export default InviteGame