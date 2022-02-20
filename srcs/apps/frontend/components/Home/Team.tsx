import React, { useState } from 'react'
import { SwiperSlide } from 'swiper/react'
import 'swiper/css';

const Team = ({ user }) => {

	const [mouse , setMouse] = useState(false)

  return (
	<div className="w-full h-full select-none overflow-hidden relative">
		<img className="object-cover object-center brightness-110 hover:brightness-95 hover:blur-sm blur-none w-full h-full rounded-xl transition-all " 
			onMouseOver={() => setMouse(true)} onMouseOut={() => setMouse(false)} src={user.image} alt={user.name} 
		/>
		{mouse && <h1 className="font-semibold text-4xl text-white absolute w-full bottom-1/2 text-center tracking-wide">{ user.name }</h1>}
		{mouse && <h1 className="font-semibold text-xl text-white absolute w-full bottom-3 text-center tracking-widest">{ user.role }</h1>}
	</div>
  )
}

export default Team