import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { useAppDispatch } from '../../../../app/hooks';
import { joinChannel } from '../../../../app/features/chat';
import toast from 'react-hot-toast';
import { useSocket } from '../../../../providers/SocketProvider';

function JoinChannel({ channel, isOpen, setIsOpen }) {

	const dispatch = useAppDispatch();
	const [password, setPassword] = useState('');
	const socket = useSocket();

	const handleSubmit = (e) => {
		if (channel.type === 'private' && password === '')
			return toast.error('password required')
		if (channel.type === 'private' && (password.length > 10 || password.length < 4)) 
			return toast.error('password length between 4 - 10')

		e.preventDefault();
		dispatch(joinChannel( { data: channel.id, password }));
		setIsOpen(false);
		setPassword('');
		socket.emit('refresh');
	}

	return (
	<Dialog
		open={isOpen}
		onClose={() => setIsOpen(false)}
		className="fixed z-10 inset-0 overflow-y-auto"
	>
		<div className="flex items-center justify-center min-h-screen">
		<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
		<div className="relative bg-white rounded mx-auto w-2/6">
			<Dialog.Title className='text-lg text-center p-4'>Join Channel</Dialog.Title>
			<form className='flex flex-col p-4' onSubmit={handleSubmit}>
				{ channel.type === "private" && (
					<>
					<label htmlFor="name" className='font-bold'>Password</label>
					<input maxLength={10}
						onChange={(e) => setPassword(e.target.value) }
						value={password}
						className='border p-2 rounded shadow-md     border-gray-400' type="password"  />
					</>
				) }
				<button className='bg-green-400 p-2 text-white mt-3 shadow-md rounded-md hover:bg-green-300'>Join</button>
			</form>
		</div>
		</div>
	</Dialog>
	)
}

export default JoinChannel;