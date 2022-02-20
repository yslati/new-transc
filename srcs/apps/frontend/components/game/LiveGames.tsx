import { StatusOnlineIcon } from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../../providers/SocketProvider'
import LiveGameCard from './components/LiveGameCard'


const LiveGames = () => {

	const [gamesInfo, setGamesInfo] = useState([])
	const socket = useSocket()

	useEffect(() => {
		socket.on('live_games', (games) => {
			setGamesInfo(games)
		})
		let tmp = setInterval(() => {
			socket.emit('live_games')
		}, 1000)
		
		return () => {
			clearInterval(tmp)
			socket.off('live_games');
		}
	}, [])

  return (
	<div className="h-screen w-screen flex flex-col items-center p-4 overflow-x-hidden">
		<h1 className="text-4xl font-semibold tracking-widest mt-10 text-slate-500 flex items-center justify-center select-none">
			<StatusOnlineIcon className="h-14 w-14 mr-4 text-green-400 animate-pulse" />
			Live Games
		</h1>
		{
			gamesInfo.length ?
			<div className="w-full grid 3xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 justify-center mt-10">
			{
				gamesInfo.map(game =>
					<LiveGameCard key={game.userId} game={game} />
				)
			}
		</div> :
			<div className="w-full h-full flex items-center justify-center select-none">
				<h1 className="text-8xl font-semibold text-gray-400/50 text-center">
					No Live Games
				</h1>
			</div>
		}
	</div>
  )
}

export default LiveGames