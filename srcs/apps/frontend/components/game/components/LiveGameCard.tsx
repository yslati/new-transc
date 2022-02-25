import { StatusOnlineIcon, UserIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../../app/hooks'

const LiveGameCard = ({ game }) => {

	const auth = useAppSelector(state => state.user.user)
	const navigate = useNavigate()

	const [watch, setWatch] = useState(false)

	useEffect(() => {
		if(watch)
			navigate("/watch", { state: { userId: game.userId } })
	}, [watch])

  return (
	<div className="mt-10 w-96 h-64 bg-gray-900 hover:bg-black rounded-xl m-auto hover:scale-110 cursor-pointer transform transition-all flex flex-col shadow-md shadow-gray-300"
		onClick={() => setWatch(true)}
	>
		<div className="flex h-full relative gap-2">
			<div className="w-1/2 h-full rounded-l-xl flex flex-col items-center">
				<img src={game.image1} className="object-cover object-center rounded-full h-32 w-32 my-auto" />
				<h2 className="font-semibold tracking-wider font-mono text-yellow-300 flex items-center">
					<UserIcon className="w-4 h-4 mr-2" />	
					{game.username1}
				</h2>
			</div>

			<h2 className="w-full absolute text-center top-24 text-4xl font-bold text-yellow-300">VS</h2>
			<div className="w-full gameFont absolute text-center text-zinc-100 text-xl mt-5 top-36 left-36 font-bold flex space-x-5">
				{<h3>{game.score1}</h3>}
				<h3>:</h3>
				<h3>{game.score2}</h3>
			</div>

			<div className="w-1/2 h-full rounded-r-xl flex flex-col items-center">
				<img src={game.image2} className="object-cover object-center rounded-full h-32 w-32 my-auto" />
				<h2 className="font-semibold tracking-wider font-mono text-yellow-300 flex items-center">
					<UserIcon className="w-4 h-4 mr-2" />	
					{game.username2}
				</h2>
			</div>
		</div>

		<h2 className="w-full text-center py-1 tracking-wider text-zinc-100 font-semibold">
			{ game.type } Pong
		</h2>
	</div>
  )
}

export default LiveGameCard