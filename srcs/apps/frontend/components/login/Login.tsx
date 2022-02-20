import { ArrowNarrowRightIcon } from '@heroicons/react/outline'
import React from 'react'
import { url } from '../../services/api'

const Login = () => {

    return (
        <div className="font-mono w-screen h-screen flex bg-BGF bg-gradient-to-r from-BGF to-BGT">
            <div className="bg-slate-50 m-auto md:shadow-xl border h-screen w-screen md:w-120 md:h-96 md:rounded-xl p-5 flex flex-col">
                <div className="mx-auto md:m-auto ">
                    <img src="./images/pong_logo.png" alt="" className="mx-auto w-40" />
                    <a href={`${url}/auth`}>
                        <button className="flex  justify-between shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded-md w-40 mt-36 md:mt-7 ml-auto" type="button">
                            Log In
                            <ArrowNarrowRightIcon  className="h-6 w-6"/>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login
