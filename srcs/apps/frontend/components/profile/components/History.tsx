import React, { useEffect } from 'react'
import { getGamesHistory } from '../../../app/features/game';
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import Result from './Result'

const History = ({ id }) => {

	const dispatch = useAppDispatch();
	const auth = useAppSelector(state => state.user)
	const games = useAppSelector(state => state.game.games);

	useEffect(() => {
		dispatch(getGamesHistory({ id }));
	}, []);

	return (
		<div className="md:p-4 pt-3 md:h-full h-60">
			<h2 className="text-center md:text-base text-sm">Game History</h2>
			<div className="md:mx-3 mt-4">
				{games.map((game, index) => <Result key={index} game={game} id={id} />)}
			</div>
		</div>
	)
}

export default History