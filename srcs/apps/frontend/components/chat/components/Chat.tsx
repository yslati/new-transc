import React, { useEffect, useState } from 'react';
import { addMessage } from '../../../app/features/chat';
import { fetchMessageById, sendMessage, updateSocket } from '../../../app/features/directChat';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { useSocket } from '../../../providers/SocketProvider';
import LeftChat from './LeftChat';
import RightChat from './RightChat';
import PropTypes from 'prop-types';

const Chat = ({ user }) => {

	const dispatch = useAppDispatch()
	const socket = useSocket();

	const [message, setMessage] = useState('');
	const [enter, setEnter] = useState(false);

	const auth = useAppSelector(state => state.user)
	const directChat = useAppSelector(state => state.directChat);

	const dispatchMessage = (e) => {
		if (e.keyCode === 13 && message && message.trim().length > 0)
		{
			const args = {
				user: auth.user,
				id: user.id,
				message
			}
			socket.emit('sendMsg', args);
			setMessage('')
			setEnter(!enter)
		}
	}

	useEffect(() => {
			dispatch(fetchMessageById({ id: user.id}));
		socket.on('newMsgHere', (arg) => {
			dispatch(fetchMessageById({ id: user.id}));
			const scroolMe = document.getElementById("scrollme")
			scroolMe.scrollTop = scroolMe.scrollHeight
		})
		return () => {
			socket.off('newMsgHere');
		}
	}, [])
	
	useEffect(() => {
		dispatch(updateSocket(socket));
		dispatch(sendMessage(message));

	
	}, [enter, user, directChat.messages.length])
	

  return (
	<div className="flex flex-col h-full w-full">
		<div id="scrollme" className="h-full flex flex-col md:mt-2 mt-0.5 overflow-y-scroll scrollbar-hide justify-start mb-1">
			{directChat.messages.map((msg,i) => (
				msg.sender.id === auth.user.id ?
					<RightChat key={i} message={msg.message} user={auth.user} /> :
					<LeftChat key={i} message={msg.message} user={user} />
			))}
		</div>
		<input onChange={(e) => setMessage(e.target.value)} onKeyDown={dispatchMessage} className="w-full bg-gray-300 mb-2 py-4 px-3 rounded-xl focus:outline-none mt-auto" type="text" placeholder="type your message here..." value={message} />
	</div>
  );
};

Chat.propTypes = {
	user: PropTypes.object
}

export default Chat;
