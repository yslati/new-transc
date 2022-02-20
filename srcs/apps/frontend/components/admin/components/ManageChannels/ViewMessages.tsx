import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useRef, useEffect } from 'react'
import Messages from './Messages';

const ViewMessages = ({ channel }) => {

	useEffect(() => {

	}, []);

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
					<div className="w-full h-96 max-w-md px-2 sm:px-0 flex-1">
						<div className=' flex h-full mx-w-md'>
							<Messages channel={channel} />
						</div>
					</div>
				</div>
			</Transition.Child>
		</div>
	)
}

export default ViewMessages
