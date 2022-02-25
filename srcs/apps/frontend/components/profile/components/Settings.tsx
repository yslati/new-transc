import { Dialog, Transition } from '@headlessui/react'
import { RefreshIcon, UploadIcon } from '@heroicons/react/outline'
import React, { Fragment, useState } from 'react'
import { updateConnectedUser, updateUser2fa, updateUserAvatar } from '../../../app/features/user'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'


const Settings = () => {

	const auth = useAppSelector(state => state.user)
	const dispatch = useAppDispatch()

	const [image, setImage] = useState(null);
	const [username, setUsername] = useState('');
	const [twofa, setTwofa] = useState(auth.user.enableTwoFactorAuth)
	const [loading, setLoading] = useState(false)
	
	const handleSelectedImage = (e) => {
		var file = e.target.files[0]
		setImage(file);
	}

	const handleSubmit = (e) => {
		e.preventDefault();
	
		if (username.length > 4 && username.length <= 10 || auth.user.enableTwoFactorAuth != twofa){
			setLoading(true)
			dispatch(updateConnectedUser({ username: username || auth.user.displayName, twofa }))
			.then(() => {
				setUsername('')
				setLoading(false)
			})
		}
		
		if (image) {
			const formData = new FormData()
			formData.append("avatar", image)
			setLoading(true)
			dispatch(updateUserAvatar({ avatar: formData }))
			.then(() => {
				setImage(null)
				setLoading(false)
			})
		}
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
				<Dialog.Overlay className="fixed inset-0 bg-black/25" />
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
				<div className="inline-block w-full max-w-md p-6 align-middle transition-all transform bg-white shadow-md shadow-gray-500 rounded-2xl">
					<div className="md:w-100 h-96 md:h-auto px-8 overflow-hidden">
						<div className="flex items-center ">
							<label className="mx-auto relative">
								<input type="file" onChange={handleSelectedImage} name="image" id="image" className="hidden md:w-16 md:h-16" accept="image/*" />
								<img src={image ? URL.createObjectURL(image) : auth.user.avatar} className="mb-4 object-cover object-center w-16 md:w-36 h-16 md:h-36 flex-none rounded-full border-2 border-gray-500 shadow-lg "/>
								<div className="md:w-36 w-16 md:h-36 h-16 absolute rounded-full left-0 top-0 transition-all opacity-0 hover:opacity-50 bg-black flex">
									<h4 className="m-auto text-xs font-bold text-white opacity-100">CHANGE<br/>AVATAR</h4>
								</div>
								<UploadIcon className="md:h-9 md:w-9 h-4 w-4 bg-gray-200  rounded-full p-1 md:p-2 text-gray-700 absolute right-0 top-3" />
							</label>
						</div>
						<form onSubmit={handleSubmit} className="h-60 md:h-52 mx-auto flex flex-col mt-6">
							<div className="md:flex md:items-center mb-3">
								<div className="md:w-1/3">
									<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Username</label>
								</div>
								<div className="md:w-2/3">
									<input onChange={(e) => setUsername(e.target.value)} value={username} minLength={6} maxLength={8} className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-yellow-500" id="username" type="text" placeholder={auth.user.displayName} />
								</div>
							</div>
							<div className="md:flex mt-3">
								<div className="md:w-1/3 mb-auto">
									<label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">Enable Auth</label>
								</div>
								<div className="md:w-2/3">
									<label className="flex items-center cursor-pointer mt-1">
										<div className="relative">
											{twofa ? <input type="checkbox" onClick={() => setTwofa(false)} className="sr-only" defaultChecked /> :
											<input type="checkbox" onClick={() => setTwofa(true)} className="sr-only" />}
											<div className="block bg-gray-600 w-10 h-5 rounded-full"></div>
											<div className="dot absolute left-2 top-1 bg-white w-3 h-3 rounded-full transition"></div>
										</div>
									</label>
								</div>
							</div>
							<button disabled={loading} className="flex items-center shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded ml-auto mt-auto" type="submit">
								SAVE
								{loading && <RefreshIcon className="ml-3 h-5 w-5 animate-spin" /> }
							</button>
							
						</form>
					</div>
				</div>
			</Transition.Child>
		</div>
	)
}

export default Settings
