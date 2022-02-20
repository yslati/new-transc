import React from 'react'

const Result = ({ game, id }) => {

	const win:boolean = id === game.winnerId;

	return (
		<div className="w-full my-3 bg-gray-200 flex rounded-full shadow-md">
			<div className="flex items-center w-40">
				<img src={game.image1} className="object-cover object-center w-10 md:w-14 h-10 md:h-14 rounded-l-full"/>
				<h3 className="md:ml-4 ml-2 md:text-base tracking-wider font-medium text-sm">
					{game.username1}
				</h3>
			</div>
			<div className="flex mx-auto self-center text-center font-semibold text-xl">
				<h3 className="mr-5">{game.score1}</h3>
				{win ? 
					<div className="w-14 text-green-600">
						WIN
					</div> :
					<div className="w-14 text-red-500">
						LOSE
					</div>
				}
				<h3 className="ml-5">{game.score2}</h3>
			</div>
			<div className="flex items-center justify-end w-40">
				<h3 className="md:mr-4 mr-2 md:text-base tracking-wider font-medium text-sm">
					{game.username2}
				</h3>
				<img src={game.image2} className="object-cover object-center w-10 md:w-14 h-10 md:h-14 rounded-r-full"/>
			</div>
		</div>
	)
}

export default Result