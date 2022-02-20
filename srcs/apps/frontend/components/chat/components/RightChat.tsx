import React from 'react'

const RightChat = ({ message, user }) => {
	return (
		<div className="flex justify-end mb-4 first:mt-auto">
			<div className="space-y-3">
				<div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-br-xl rounded-tl-3xl text-white" >
					{message}
				</div>

				{/* <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-br-xl rounded-tl-3xl text-white">
					Lorem ipsum dolor sit amet consectetur adipisicing elit.
					Debitis, reiciendis!
				</div> */}

			</div>
			<img src={user.avatar} className="object-cover h-8 w-8 rounded-full"
			/>
		</div>
	)
}

export default RightChat
