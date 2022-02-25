import React, { useState } from 'react'
import { useAppSelector } from '../../app/hooks'

const AuthPage = () => {

	const user = useAppSelector(state => state.user)
	const [pinCode, setPinCode] = useState('')

	const submitForm = (e) => {
		e.preventDefault();
	}

	return (
		<div className="w-screen h-screen flex bg-slate-200">
			<div className="m-auto  w-full bg-slate-50 md:h-110 h-full md:w-110 rounded py-10 px-8 md:px-16 shadow-xl">
				<div className="mt-20 text-center flex flex-col tracking-wider">
					<h1 className="text-xl font-medium text-gray-700 mb-2">Two-step verification</h1>
					<div className="font-light text-gray-600">Thanks for keeping you account secure.</div>
					<div className="font-light text-gray-600 flex mx-auto">check your intra email <h2 className="ml-2 font-medium text-gray-800">{user.user.username}@xxxx</h2></div>
				</div>
				<form onSubmit={submitForm} className="flex flex-col mt-10">
					<label className="mb-2 text-gray-700 font-medium ">Your Verification Code</label>
					<input onChange={(e) => setPinCode(e.target.value)}
						value={pinCode} minLength={6} maxLength={6} required
						className="mb-5 tracking-widest font-medium border border-gray-400 appearance-none border-b-2 rounded py-2 px-4 text-gray-700 leading-tight focus:outline-none 
						focus:bg-white focus:border-yellow-500" name="pinCode" id="pinCode" type="text" placeholder="6-digit code" />

					<button type="submit" className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline focus:outline-none text-black font-bold py-2 px-4 rounded mt-auto">
						Sign In Securely
					</button>
				</form>
			</div>
			
		</div>
	)
}

export default AuthPage
