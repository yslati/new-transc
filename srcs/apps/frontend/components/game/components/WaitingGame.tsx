import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { joinGame } from '../../../app/features/game';
import { useAppSelector } from '../../../app/hooks';
import { useSocket } from '../../../providers/SocketProvider';

const WaitingGame = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const joined = useAppSelector(state => state.game.joined);

    const join = (type: string) => {
        socket.emit("join_queue_match", type);
        dispatch(joinGame());
    };

    return (
        <div className="game-bg flex lg:flex-row flex-col-reverse lg:justify-around lg:items-center h-full w-full" >
            <div className=" flex flex-col lg:justify-center items-center lg:h-full lg:w-1/2 ml-8 flex-1">
            <h1 className="h1 select-none text-GameFontColor"> Trans-Pong </h1>
            {!joined && <h3 className="h3 mt-10 select-none text-GameFontColor"> Join a game</h3>}
                
                {!joined &&
                
                    <div className='flex'>
                        <button
                            onClick={() => join("dual")}
                            className="button button1 px-6 pt-3 pb-2 select-none"
                        >
                            Dual Pong
                        </button>
                        <button
                            onClick={() => join("triple")}
                            className="button button2 px-6 pt-3 pb-2 select-none bg-gray-800"
                        >
                            Triple Pong
                        </button>
                    </div>}
                {
                    joined &&
                    <div className='flex'>
                        <h2 className='h4 select-none text-GameFontColor'>
                            Joined, waiting for opponent...
                        </h2>
                    </div>
                }
            </div>
            <div className='lg:w-120 w-full flex flex-col flex-1 items-center justify-center'>
                <img className='w-130 pointer-events-none select-none' src='/images/game_bg.png' />
            </div>
        </div>
    );
};

export default WaitingGame;
