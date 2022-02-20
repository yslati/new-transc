import React, { useEffect, useState } from 'react'
import Carousel from './Home/Carousel'
import { ChevronDoubleUpIcon } from '@heroicons/react/solid'

const HomePage = () => {

    const [showButton, setShowButton] = useState(false);
    
    const toTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        window.addEventListener("scroll", () => {
        window.pageYOffset > 300 ?
            setShowButton(true)
        :
            setShowButton(false)
        });
    }, []);

    return (
        <div className='h-screen w-full bg-LBLUE overflow-y-auto  text-black'>
            <div id="topscreen" className="w-full md:h-110 mt-14 flex flex-col lg:flex-row px-5 ">
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
                    <img className="select-none rounded-xl shadow-lg" src="./images/pingpong-2.gif" />
                </div>
                <div className="lg:w-1/2 w-full h-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl lg:mt-0 mt-10 font-mono font-medium">Trans-Pong Game</h1>
                    <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-md font-light lg:max-w-md">
                        Trans-Pong is a game where two players try to hit each other with a ball.
                        The goal is to get the ball to the other side of the map.
                        The player who gets the ball to the other side wins a round.
                        The player who first wins 10 rounds wins the game.
                        The player can leave the game at any time with the leave button below the map, but he will get Zero in his score.
                        If a player leaves the game, the other player will get a point.
                        If a player has logout and has been absent for more than 10 seconds, he will lose with a Zero in his score, and his opponent will win.
                        A player can move his paddle with the arrow up and down keys on the keyboard.
                        A Player can pause the game at any time with space key on the keyboard, and the pause remains for 3 seconds, then the game resumes automatically.
                        Enjoy the game!

                    </p>
                    </div>
            </div>

            <div className="w-full md:h-110 mt-20 flex flex-col-reverse lg:flex-row px-5">
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl lg:mt-0 md:mt-10 mt-20 font-mono font-medium">Online Chat</h1>
                    <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">Lorem Ipssdfum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
                    <img className="select-none" src="./images/chat.jpg" alt="" />
                </div>
            </div>

            <div className="w-full md:h-110 mt-20 flex flex-col lg:flex-row px-5">
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
                    <img className="select-none " src="./images/channels.png" alt="" />
                </div>
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl lg:mt-0 mt-10 font-mono font-medium">Group Chat</h1>
                    <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">Lorem Ipssdfum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
            </div>

            <div className="w-full md:h-110 mt-20 flex flex-col-reverse lg:flex-row px-5">
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
                    <h1 className="text-3xl lg:mt-0 md:mt-10 mt-20 font-mono font-medium">Live Stream</h1>
                    <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">Lorem Ipssdfum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                </div>
                <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
                    <img className="select-none" src="./images/live.png" alt="" />
                </div>
            </div>

            <div className="w-full h-110 flex flex-col mt-20">
                <h1 className="mx-auto text-2xl font-medium tracking-wider mb-8">Our Team</h1>
                <Carousel />
            </div>

            <div className="bg-gray-800 w-full h-52 lg:mt-10 mt-20 text-white flex flex-col pb-3">
                <div className="w-full h-full flex space-x-44 pt-10 px-10">
                    <div className="cursor-pointer flex flex-col space-y-2 tracking-wider text">
                        <a href="https://github.com/medymik/ft_transcendence" target="_blank">
                            <h2 className="hover:text-sky-400">Github</h2>
                        </a>
                        <a href="/docs/en.subject.pdf" target="_blank">
                            <h2 className="hover:text-sky-400">Subject</h2>
                        </a>
                    </div>
                    <div className="cursor-pointer flex flex-col space-y-1 tracking-wider text overflow-hidden">
                        <a href="https://github.com/yslati" target="_blank">
                            <h2 className="hover:text-sky-400">yslati</h2>
                        </a>
                        <a href="https://github.com/pyt45" target="_blank">
                            <h2 className="hover:text-sky-400">aaqlzim</h2>
                        </a>
                        <a href="https://github.com/ombhd" target="_blank">
                            <h2 className="hover:text-sky-400">obouykou</h2>
                        </a>
                        <a href="https://github.com/medymik" target="_blank">
                            <h2 className="hover:text-sky-400">mymik</h2>
                        </a>
                    </div>
                </div>
                <div className="mt-auto mx-auto flex space-x-2 select-none">
                    <p className="font-thin tracking-wide">All Rights Reserved to</p>
                    <p className="font-medium text-blue-400 hover:text-cyan-400 cursor-pointer">Trans Team</p>
                </div>
            </div>
            {/* { <div className="bottom-5 right-20 z-10 cursor-pointer select-none fixed">
                <ChevronDoubleUpIcon className="w-8 h-8 text-gray-500 rounded-full border p-0.5" onClick={toTop} />
            </div>} */}
        </div>
    )

}

export default HomePage
