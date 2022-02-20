import React from 'react'
import { useHooks } from '../../../../hooks/useHooks';

const ChannelLi = ({ channel }) => {
	const [members] = useHooks(channel, '/admin/channels')
	return (
		<li className="flex items-center py-3 border-b hover:bg-gray-50 rounded-md odd:bg-white even:bg-slate-50">
			<div className="ml-2 md:w-1/2 w-1/3">{ channel.name }</div>
			<div className="md:w-1/2 w-2/3 flex text-center">
				<div className="w-1/2">{members.length}</div>
				<div className="w-1/2">{ channel.type }</div>
			</div>
		</li>
	)
}

export default ChannelLi
