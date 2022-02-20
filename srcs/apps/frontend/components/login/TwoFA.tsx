import React from 'react'
import { Navigate } from 'react-router'
import { useAppSelector } from '../../app/hooks'

const TwoFA = () => {

  const auth = useAppSelector(state => state.user.user)

  if (auth)
    return (
      <Navigate to="/" />
    )

  return (
	<div className="w-screen h-screen flex justify-center items-center bg-slate-200">
    <div className="w-110 h-80 bg-white rounded-xl shadow-md shadow-gray-400 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold tracking-wider">2-Step Verification</h1>
      <h2 className="mt-5 text-gray-400 font-light tracking-wider">
        A link message was sent to youe E-mail.<br/>
        Click on the link to verify your login
      </h2>
    </div>    
  </div>
  )
}

export default TwoFA