import React, { useEffect, useState } from 'react'
import { useHooks } from '../../../../hooks/useHooks';
import api from '../../../../services/api';

const UserLi = ({ user }) => {
	const [friends] = useHooks(user, '/admin/users');

	return (
		<li className="flex items-center py-4 border-b hover:bg-gray-50 rounded-md odd:bg-white even:bg-slate-50">
			<div className="ml-2 md:w-1/2 w-1/4">
				<h1 className="">{user.displayName}</h1>
				<div className="hidden md:flex space-x-1 md:text-sm text-xs font-extralight tracking-wide">
					<div className="text-green-500">Email .</div>
					<div>{user.email}</div>
				</div>
			</div>
			<div className="md:w-1/2 w-3/4 flex text-center">
				<div className="w-1/4">{friends.length}</div>
				<div className="w-1/4">{user.type}</div>
				<div className="w-1/4">{user.enableTwoFactorAuth ? "on" : "off"}</div>
				<div className="w-1/4">{user.banned ? "true" : "false"}</div>
			</div>
		</li>
	)
}

export default UserLi