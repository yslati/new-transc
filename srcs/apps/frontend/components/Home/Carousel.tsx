import React, { useRef, useState } from 'react';
import SwiperCore, { Virtual, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Team from "./Team";

const team = [
	{
		name: "Yassin Slati",
		image: "https://cdn.intra.42.fr/users/yslati.jpg",
		role: "Front End",
	},
	{
		name: "Ayoub Aqlzim",
		image: "https://cdn.intra.42.fr/users/aaqlzim.jpg",
		role: "Back End",
	},
	{
		name: "Omar Bouykourne",
		image: "https://cdn.intra.42.fr/users/obouykou.jpg",
		role: "Pong Game",
	},
	{
		name: "Mohammed Ymik",
		image: "https://cdn.intra.42.fr/users/mymik.jpg",
		role: "Back End",
	},
]

const Carousel = () => {

	SwiperCore.use([Virtual, Navigation, Pagination]);

	return (
	  <>
		<Swiper
		  slidesPerView={3}
		  centeredSlides={true}
		  spaceBetween={30}
		  pagination={{
			type: 'custom',
		  }}
		  navigation={true}
		  virtual
		  className="w-full md:h-96 h-80 cursor-grab"
		>
		  {team.map((user, index) => (
			<SwiperSlide key={index} virtualIndex={index} className="rounded-xl bg-white w-80 max-w-md min-w-fit max-h-min">
			  <Team user={user} />
			</SwiperSlide>
		  ))}
		</Swiper>
	  </>
	);
}

export default Carousel
