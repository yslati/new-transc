import React from 'react'
import { useNavigate } from 'react-router'
import { useAppSelector } from '../../../../app/hooks'

const Message = ({ msg, avatar, displayName, userId }) => {

    const navigate = useNavigate()
    const auth = useAppSelector(state => state.user)

    const toProfile = () => {
		userId === auth.user.id ?
		navigate(`/profile`) :
		navigate(`/user/${userId}`)
	}

    return (
        <div className='flex flex-col mt-2'>
            <div className="bg-gray-400 flex p-2 rounded-t-xl items-center justify-between">
                <div className='flex items-center'>
                    <img className='h-10 w-10 rounded-full cursor-pointer hover:brightness-90' src={avatar} alt="" onClick={() => toProfile()} />
                    <span className="text-white ml-2 font-bold cursor-pointer hover:text-gray-200" onClick={() => toProfile()}>{displayName}</span>
                </div>
            </div>
            <div className='bg-gray-600 py-4 px-2 rounded-br-xl rounded-b-xl shadow-3xl'>
                <p className='break-words text-white flex-1 text-wrap'>{msg}</p>
            </div>
        </div>
    )
}

export default Message
