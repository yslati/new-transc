import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getLeaderboard } from '../../app/features/users'
import { useAppSelector } from '../../app/hooks'
import BoardLi from './components/BoardLi'

const Leaderboard = () => {

  const dispatch = useDispatch()
  const { leaderboard } = useAppSelector(state => state.users)
  
  useEffect(() => {
    dispatch(getLeaderboard())

  }, [])  

  return (
	<div className="h-screen w-screen flex flex-col p-2">
    <h1 className="text-2xl font-semibold tracking-wider mt-10 md:ml-10 ml-2 text-gray-700">
      LeaderBoard - Top Players
    </h1>
    <ul className="mb-1 md:w-140 w-full h-full md:px-10 mt-10 mx-auto">
				<li className="flex items-center py-3 font-semibold bg-gray-200 text-gray-600 md:text-base text-sm border border-gray-400 rounded-t-md select-none">
          <div className="w-16 flex justify-center">#</div>
          <div className="w-full flex justify-center items-center ">
					  <h3 className="w-1/2">Username</h3>
					  <h3 className="">score</h3>
					  <h3 className="ml-auto w-20 text-center">profile</h3>
          </div>
				</li>
        {
          leaderboard.map((user, index) => <BoardLi key={index} user={user} index={index + 1} />)
        }
			</ul>
  </div>
  )
}

export default Leaderboard