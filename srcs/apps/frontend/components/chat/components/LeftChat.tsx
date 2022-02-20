import React from 'react'

const LeftChat = ({ message, user }) => {
	return (
		<div className="flex justify-start mb-4 first:mt-auto">
			<img
				src={user.avatar}
				className="object-cover h-8 w-8 rounded-full"
			/>
			<div className="space-y-3">
				<div className="ml-2 py-3 px-4 bg-slate-500 rounded-br-3xl rounded-bl-xl rounded-tr-3xl text-white">
					{message}
				</div>
				{/* <div className="ml-2 py-3 px-4 bg-slate-500 rounded-br-3xl rounded-bl-xl rounded-tr-3xl text-white">
					aut ullam delectus odio error sit rem. Architecto
					nulla doloribus laborum illo rem enim dolor odio saepe,
					consequatur quas?
				</div>
				<div className="ml-2 py-3 px-4 bg-slate-500 rounded-br-3xl rounded-bl-xl rounded-tr-3xl text-white">
					aut ullam delectus odio error sit rem. Architecto
					nulla doloribus laborum illo rem enim dolor odio saepe,
					consequatur quas?
				</div> */}
			</div>
		</div>
	)
}

export default LeftChat
