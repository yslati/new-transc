import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { LockOpenIcon, LockClosedIcon } from '@heroicons/react/outline';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { createChannel, selectedChannel } from '../../../../app/features/chat';
import { useAppDispatch, useAppSelector } from '../../../../app/hooks';

const AddChannel = () => {

    const dispatch = useAppDispatch();
    const { selectedId, allChannels, channels } = useAppSelector(state => state.chat)

    
    
    const [name, setName] = useState('');
    const [type, setType] = useState('public');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false)
    
    const handleSubmit = (e) => {
        if (name.length >= 4 && name.length <= 10) {
            if (type === 'private' && password === '' )
                return toast.error('private channel must have a password')
            if (type === 'private' && (password.length < 4 || password.length > 10))
                return toast.error('password lenght between 4 - 20')
            if (allChannels.filter(chnl => chnl.name === name).length || channels.filter(chnl => chnl.name === name).length)
                return toast.error('this name is used')

            e.preventDefault();
            dispatch(createChannel({
                name: name,
                type: type,
                password: password
            }));
            setName('');
            setType('public')
            setPassword('')
            dispatch(selectedChannel(selectedId));
        }
        else if (name.length > 10)
            return toast.error('max channel name is 10 charactes')
        else if (name.length < 4)
            return toast.error('min channel name is 4 charactes')
    }

    name[0] === ' ' && setName(name.substring(1))
    password[0] === ' ' && setPassword(password.substring(1))

    return (
        <div className='w-full bg-white flex flex-col p-2'>
            <h4 className='font-bold mb-2'>Create new channel</h4>
            <form>
                <div className="flex items-center w-full">
                    <input type="text" placeholder='channel name' minLength={4} maxLength={10} required
                        value={name} onChange={(e) => setName(e.target.value)}
                        className='border-2 border-gray-500 w-48 p-2 rounded-md shadow-md' />
                    <div className="cursor-pointer mx-auto">
                        { type === "private" ?
                                <LockClosedIcon onClick={() => setType("public")} className="h-7 w-7 text-gray-600 hover:text-gray-700 " /> :
                                <LockOpenIcon onClick={() => setType("private")} className="h-7 w-7 text-gray-600 hover:text-gray-700" />
                        }
                    </div>
                </div>
                { type === "private" && (
                    <div className="inline-flex items-center space-x-2 mt-2 rounded-md relative">
                        <input  type={visible ? "text" : "password"} placeholder='Password'
                        value={password} required minLength={4} maxLength={10}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border-2 border-gray-500 w-48 p-2 rounded-md shadow-md' />
                        <button className="rounded-md px-1 block absolute left-36">
                            {!visible ?
                                <EyeOffIcon onClick={() => setVisible(true)} className="h-6 w-6 text-gray-600" /> :
                                <EyeIcon onClick={() => setVisible(false)} className="h-6 w-6 text-gray-600" />
                            }
                        </button>
                    </div>
                )}
                <button onClick={handleSubmit} className='bg-blue-500  px-4 py-2 w-full mt-2 text-white font-medium rounded'>Add</button>
            </form>
        </div>
    )
}

export default AddChannel
