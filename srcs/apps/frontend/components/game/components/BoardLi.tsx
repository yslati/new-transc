import { ArrowsExpandIcon } from '@heroicons/react/solid'
import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../../app/hooks'

const BoardLi = ({ user, index }) => {

	const navigate = useNavigate()
	const auth = useAppSelector(state => state.user)

	const blockedUsers = useAppSelector(state => state.users.blocked);

	const canNavigate = (userId: number) => {
			if (blockedUsers.find(tmp => tmp.id === userId)) {
				return false;
			}
			return true;
	}
	
    const toProfile = () => {
		user.id === auth.user.id ?
		navigate(`/profile`) :
		navigate(`/user/${user.id}`)
	}


	return (
		<li className="flex items-center py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 
			md:text-base text-sm tracking-wider font-medium
			border-b border-r border-l border-gray-400 last:rounded-b-md">
			{ index === 1 &&
				<div className="w-16 flex justify-center ">
					<h3 className="bg-yellow-400 rounded-full px-2 text-white">
						{index}
					</h3>
				</div>
			}
			{ index === 2 &&
				<div className="w-16 flex justify-center">
					<h3 className="bg-slate-300 rounded-full px-2 text-white">
						{index}
					</h3>
				</div>
			}
			{ index === 3 &&
				<div className="w-16 flex justify-center">
					<h3 className="bg-orange-300 rounded-full px-2 text-white">
						{index}
					</h3>
				</div>
			}
			{ index > 3 &&
				<div className="w-16 flex justify-center">{index}</div>
			}
			<div className="w-full flex justify-center items-center ">
				<div className="w-1/2 ml-2 flex items-center space-x-5">
					<img src={user.avatar}
						className="object-cover object-center h-9 w-9 rounded-full hover:brightness-110 border border-gray-400 select-none"
					/>
					<h3 className="">
						{user.displayName}
					</h3>
				</div>
				<h3 className="w-6 text-center">{ user.score }</h3>
				{ canNavigate(user.id) ?

					<button className="ml-auto w-20 text-center flex justify-center" onClick={() => toProfile()}>
						<ArrowsExpandIcon className="w-5 h-5 cursor-pointer hover:text-gray-400" />
					</button> :
					<button className="ml-auto w-20 text-center flex justify-center" onClick={() => {}}>
					</button>
				}
			</div>
		</li>
	)
}

export default BoardLi