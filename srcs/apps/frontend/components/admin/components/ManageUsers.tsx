import React from 'react'
import { useAppSelector } from '../../../app/hooks'
import ManageUserLi from './ManageUsers/ManageUserLi'

const ManageUsers = () => {

	const users = useAppSelector(state => state.admin.users)

	return (
		<div className="h-full w-full py-5 mt-14 flex flex-col ">
			<ul className="mb-1 lg:w-full md:w-140 w-full lg:mx-0 mx-auto">
				<li className="flex items-center py-4 border-b text-gray-400 text-sm font-light">
					<div className="ml-2 md:w-1/3 w-1/5"> All users </div>
					<div className="md:w-2/3 w-4/5 flex text-center">
						<div className="w-1/6"> Status </div>
						<div className="w-1/6"> Type </div>
						<div className="w-1/6"> 2FA </div>
						<div className="w-1/6"> Delete </div>
						<div className="w-1/6"> Ban </div>
						<div className="w-1/6"> Admin </div>
					</div>
				</li>
				{
					users.map((user, index) => <ManageUserLi key={index} user={user} />)
				}
				
			</ul>
		</div>
	)
}

export default ManageUsers
