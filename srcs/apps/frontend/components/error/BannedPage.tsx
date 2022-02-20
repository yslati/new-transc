import { EmojiSadIcon } from '@heroicons/react/outline'
import React from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAppSelector } from '../../app/hooks'

const BannedPage = () => {

	const auth = useAppSelector(state => state.user.user)
	const location = useLocation()

  if (auth && !auth.banned)
    return (
      <Navigate to="/" />
    )

  return (
	<div className="w-screen h-screen flex justify-center items-center">
		<EmojiSadIcon className="w-14 h-14 text-red-400 mr-2" />
		<h1 className="text-5xl font-semibold tracking-wider text-red-400">
			Your are Banned
		</h1>
	</div>
  )
}

export default BannedPage