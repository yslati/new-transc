import React from "react";
import { url } from "../../services/api";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const welcomeVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 1, duration: 1.5 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    y: 450,
  },
  visible: {
    opacity: 1,
    y: 10,
    transition: { delay: 2, type: "spring", stiffness: 40 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const buttonVariants = {
  hidden: {
    opacity: 0,
    y: 450,
  },
  visible: {
    opacity: 1,
    y: 10,
    transition: { delay: 2.6, type: "spring", stiffness: 40 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const walletVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { delay: 2.8, duration: 1.5 },
  },
  exit: {
    x: "-100vh",
    transition: { ease: "easeInOut" },
  },
};

const Login = () => {
  const [animate, setAnimate] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timer = setTimeout(() => {
      setAnimate(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="bg-black relative text-white">
      <div className="flex flex-col absolute z-50 h-4/5 w-full items-start justify-center space-y-4 space-x-8">
        <div></div>
        <motion.p
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="text-4xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-700 to-gray-100"
        >
          Welcome to <br />
          Transcendence
        </motion.p>
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="font-bold text-xl text-slate-400">
            The Best Place To Play
          </p>
          <p className="font-bold text-xl text-slate-400">
            Pong With Your Friends
          </p>
        </motion.div>
        <motion.button
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={() => router.push(`${url}/auth`)}
          className={`py-4 font-bold rounded-lg text-white bg-gradient-to-r from-yellow-600 to-yellow-200 
          ${animate && "animate-pulse"} hover:animate-none w-1/4`}
        >
          Login
        </motion.button>
        <motion.div
          variants={walletVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <p className="text-slate-500 italic">
            Login require your intra account!
          </p>
        </motion.div>
      </div>
      <div className="w-full h-screen">
        <Image src="/images/xx.gif" layout="fill" objectFit="cover" alt="" />
      </div>
    </div>
  );
};

export default Login;
