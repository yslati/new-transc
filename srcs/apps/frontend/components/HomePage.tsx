/* eslint-disable @next/next/no-img-element */
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const squareVariants = {
  visible: { opacity: 1, scale: 1, transition: { duration: 1 } },
  hidden: { opacity: 0, scale: 0 },
};

const leftVariants = {
  visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 1 } },
  hidden: { opacity: 0, scale: 1, x: 450 },
};

const welcomeVariants = {
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

const HomePage = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView();
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <div className="h-screen w-full bg-LBLUE overflow-y-auto  text-black">
      <header className="relative flex items-center justify-center h-screen mb-12 overflow-hidden">
        <motion.p
          variants={welcomeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative z-30 p-5 text-2xl text-white bg-gray-300 bg-opacity-50 rounded-xl animate-pulse"
        >
          Welcome to Transcendence
        </motion.p>
        <video
          autoPlay
          loop
          muted
          className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
        >
          <source src="./images/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </header>

      <div
        id="topscreen"
        className="w-full md:h-110 mt-14 flex flex-col lg:flex-row px-5 "
      >
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={squareVariants}
            className="square"
          >
            <img
              className="select-none rounded-xl shadow-lg"
              src="./images/pingpong-2.gif"
              alt=""
            />
          </motion.div>
        </div>

        <div className="lg:w-1/2 w-full h-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={leftVariants}
            className="square"
          >
            <h1 className="text-3xl lg:mt-0 mt-10 font-mono font-medium">
              Trans-Pong Game
            </h1>
          </motion.div>
          <motion.div
            ref={ref}
            animate={controls}
            initial="hidden"
            variants={leftVariants}
            className="square"
          >
            <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-md font-light lg:max-w-md">
              Trans-Pong is a game where two players try to hit each other with
              a ball. The goal is to get the ball to the other side of the map.
              The player who gets the ball to the other side wins a round. The
              player who first wins 10 rounds wins the game. The player can
              leave the game at any time with the leave button below the map,
              but he will get Zero in his score. If a player leaves the game,
              the other player will get a point. If a player has logout and has
              been absent for more than 10 seconds, he will lose with a Zero in
              his score, and his opponent will win. A player can move his paddle
              with the arrow up and down keys on the keyboard. A Player can
              pause the game at any time with space key on the keyboard, and the
              pause remains for 3 seconds, then the game resumes automatically.
              Enjoy the game!
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full md:h-110 mt-20 flex flex-col-reverse lg:flex-row px-5">
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
          <h1 className="text-3xl lg:mt-0 md:mt-10 mt-20 font-mono font-medium">
            Online Chat
          </h1>
          <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">
            Lorem Ipssdfum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
          <img className="select-none" src="./images/chat.svg" alt="" />
        </div>
      </div>

      <div className="w-full md:h-110 mt-20 flex flex-col lg:flex-row px-5">
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
          <img className="select-none " src="./images/grpChat.svg" alt="" />
        </div>
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
          <h1 className="text-3xl lg:mt-0 mt-10 font-mono font-medium">
            Group Chat
          </h1>
          <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">
            Lorem Ipssdfum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>
      </div>

      <div className="w-full md:h-110 mt-20 flex flex-col-reverse lg:flex-row px-5">
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex flex-col items-center justify-center">
          <h1 className="text-3xl lg:mt-0 md:mt-10 mt-20 font-mono font-medium">
            Live Stream
          </h1>
          <p className="md:mt-8 mt-5 md:mx-14 mx-4 tracking-wider text-lg font-light lg:max-w-md">
            Lorem Ipssdfum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry standard dummy text ever
            since the 1500s, when an unknown printer took a galley of type and
            scrambled it to make a type specimen book.
          </p>
        </div>
        <div className="lg:w-1/2 w-full lg:h-auto md:h-1/2 flex justify-center">
          <img className="select-none" src="./images/stream.svg" alt="" />
        </div>
      </div>

      <div className="bg-gray-800 w-full lg:mt-10 mt-20 text-white flex flex-col pb-3">
        <div className="mx-auto flex space-x-2 select-none mt-2">
          <p className="font-thin tracking-wide">All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
