import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'

const User = ({ user, activeUser }) => {

	return (
		<div className={user.id != activeUser?.id ? 
			"flex md:flex-row flex-col py-2 px-2 items-center md:border-b-2 hover:bg-gray-100" : 
			"flex md:flex-row flex-col py-2 px-2 items-center md:border-b-2 hover:bg-gray-100 md:bg-blue-100"} 
		>	
			<img src={user.avatar}
				className="object-cover object-center h-12 w-12 rounded-full"
			/>
			<div className="md:ml-2 ml-0 select-none md:block hidden">
				<div className="text-lg font-semibold">{user.displayName}</div>
				<span className="text-gray-500">{user.status}</span>
			</div>
			{user.id == activeUser?.id && <ChevronRightIcon className="md:block hidden h-6 w-6 ml-auto text-gray-500" />}
			{user.id == activeUser?.id && <ChevronDownIcon className="md:hidden block h-6 w-6 text-cyan-500 mx-auto" />}
		</div>
	)
}

export default User
