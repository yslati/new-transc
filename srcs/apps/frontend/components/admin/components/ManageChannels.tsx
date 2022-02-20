import React from 'react'
import { useAppSelector } from '../../../app/hooks'
import ManageChannelLi from './ManageChannels/ManageChannelLi'

const ManageChannels = () => {

	const channels = useAppSelector(state => state.admin.channels)

	return (
		<div className="h-full w-full py-5 mt-14 flex flex-col">
			<ul className="mb-1 lg:w-full md:w-140 w-full lg:mx-0 mx-auto">
				<li className="flex items-center py-3 border-b text-gray-400 md:text-sm text-xs font-light max-w-3xl">
					<div className="ml-2 md:w-1/4 w-1/5">Name</div>
					<div className="md:w-3/4 w-4/5 flex text-center">
						<div className="w-1/5 space-x-2">Nº <div className="md:block hidden">members</div></div>
						<div className="w-1/5">Type </div>
						<div className="w-1/5">Messages </div>
						<div className="w-1/5 space-x-2"><div className="md:block hidden">Manage</div> user </div>
						<div className="w-1/5">Delete </div>
					</div>
				</li>
				{ channels.map((channel, index) => <ManageChannelLi key={index} channel={channel} />) }
			</ul>
		</div>
	)
}

export default ManageChannels
