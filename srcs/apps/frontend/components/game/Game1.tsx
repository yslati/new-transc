import React, { useRef, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { cancelJoin } from "../../app/features/game";
import { useAppSelector } from "../../app/hooks";
import { useSocket } from "../../providers/SocketProvider";
import WaitingGame from "./components/WaitingGame";

export enum UserType {
  Player,
  Spectator,
}

// game state
const enum GameState {
  WAITING,
  STARTING,
  PLAYING,
  PAUSED,
  OVER,
}

interface FrameShape {
  ball: {
    x: number;
    y: number;
  };
  paddles: {
    ly: number;
    ry: number;
    my?: number;
  };
  score: {
    p1: number;
    username1: string;
    image1: string;
    p2: number;
    username2: string;
    image2: string;
  };
  state: GameState;
  startingSecond?: number;
  hasMiddlePaddle: boolean;
  hasWon: boolean;
  message?: string;
}

const Game = ({ userType }: { userType: UserType }) => {

  // constants
  const socket = useSocket();
  const Canvasref = useRef();
  const WIDTH = 1100;
  const HEIGHT = 600;
  const PADDLE_HEIGHT = HEIGHT / 6;
  const PADDLE_WIDTH = 20;
  const BALL_RADIUS = 9;
  const L_PADDLE_X = 0;
  const R_PADDLE_X = WIDTH - PADDLE_WIDTH;
  const M_PADDLE_X = WIDTH / 2 - PADDLE_WIDTH / 2;
  const PADDLE_INIT_Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
  const MIDDLE_PADDLE_INIT_Y = HEIGHT - PADDLE_HEIGHT - PADDLE_WIDTH / 2;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  // initial state
  const initialState: FrameShape = {
    ball: {
      x: WIDTH / 2,
      y: HEIGHT / 2,
    },
    paddles: {
      ly: PADDLE_INIT_Y,
      ry: PADDLE_INIT_Y,
      my: MIDDLE_PADDLE_INIT_Y,
    },
    score: {
      p1: 0,
      username1: '',
      image1: '',
      p2: 0,
      username2: '',
      image2: '',
    },
    state: GameState.WAITING,
    hasMiddlePaddle: false,
    hasWon: false,
  };
  // state of the frame
  const [frame, setframe] = useState(initialState);
  // if the user is a spectator
  const { state } = useLocation();
  useEffect(() => {
    if (userType === UserType.Spectator && !state) {
      navigate('/liveGames');
    }
  });
  if (userType === UserType.Spectator && frame.state === GameState.WAITING) {
    socket.emit("spectator", state);
    socket.off("spectator");
  }

  useEffect(() => {
    // set up the socket
    socket.on("state", (newFrame) => {
      setframe(newFrame);
    });
    return () => {
      socket.off("state");
    };
  }, [socket]);

  const auth = useAppSelector(state => state.user);

  useEffect(() => {
    // move the paddle down
    if (userType === UserType.Spectator || frame.state === GameState.STARTING) return;
    document.addEventListener("keydown", (e) => {
      if (e.code === "ArrowUp") {
        socket.emit("up_paddle", "down");
      } else if (e.code === "ArrowDown") {
        socket.emit("down_paddle", "down");
      }
    });
    // move the paddle up
    document.addEventListener("keyup", (e) => {
      if (e.code === "ArrowUp") {
        socket.emit("up_paddle", "up");
      } else if (e.code === "ArrowDown") {
        socket.emit("down_paddle", "up");
      }
    });
    // pause the game
    document.addEventListener("keypress", (e) => {
      if (e.code === "Space") {
        socket.emit("pause_game");
      }
    });
  }, []);

  useEffect(() => {
    if (frame.state === GameState.WAITING && userType === UserType.Player) return;
    let c: any = Canvasref.current;
    let ctx = c.getContext("2d");

    function clear_init(x: number, y: number, w: number, h: number) {
      ctx.clearRect(x, y, w, h);
      ctx.beginPath();
      ctx.fillStyle = "#1F2937";
      ctx.fillRect(x, y, w, h);
      draw_separator();
    }

    function draw_ball(color: string, x: number, y: number, radius: number) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    }

    function draw_paddle(color: string, x: number, y: number) {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.beginPath();
      draw_ball(color, x + PADDLE_WIDTH / 2, y, PADDLE_WIDTH / 2);
      draw_ball(
        color,
        x + PADDLE_WIDTH / 2,
        y + PADDLE_HEIGHT,
        PADDLE_WIDTH / 2
      );
    }

    function draw_text(text: string, color: string, font: string, x: number, y: number) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    }

    function draw_separator() {
      ctx.strokeStyle = "#FFFFFF";
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      ctx.moveTo(WIDTH / 2, 0);
      ctx.lineTo(WIDTH / 2, HEIGHT);
      ctx.stroke();
    }

    async function draw() {
      clear_init(0, 0, WIDTH, HEIGHT);
      draw_text(
        frame.score.p1.toString(),
        "#FFFFFF",
        "32px Arcade Normal",
        3 * (WIDTH / 8),
        HEIGHT / 12
      );
      draw_text(
        frame.score.p2.toString(),
        "#FFFFFF",
        "32px Arcade Normal",
        5 * (WIDTH / 8) - 5,
        HEIGHT / 12
      );
      if (frame.state !== GameState.STARTING)
        draw_ball("#FFEE00", frame.ball.x, frame.ball.y, BALL_RADIUS);

      draw_paddle("#00D897", L_PADDLE_X, frame.paddles.ly);
      if (frame.hasMiddlePaddle) {
        draw_paddle("#D6D6D6", M_PADDLE_X, frame.paddles.my);
      }

      draw_paddle("#00D897", R_PADDLE_X, frame.paddles.ry);

      if (frame.state === GameState.STARTING) {
        draw_text(
          frame.startingSecond?.toString(),
          "#FFFFFF",
          "70px Arcade Normal",
          WIDTH / 2 - 25,
          HEIGHT / 2 + 25
        );
      }
      if (frame.message) {
        if (frame.message === "Pause") {
        draw_text(
          frame.message.toString(),
          "#FFFFFF",
          "70px Arcade Normal",
          WIDTH / 2 - 150,
          HEIGHT / 2 + 60
        );
        } else {
          draw_text(
            frame.message.toString(),
            "#FC7A00",
            "30px Arcade Normal",
            WIDTH / 2 - 150,
            HEIGHT / 2 + 180
          );
        }
      }

      if (frame.state === GameState.OVER) {
        // tell everyone that the game is over
        draw_text(
          "Game Over",
          "#FFFFFF",
          "32px Arcade Normal",
          WIDTH / 2 - 125,
          HEIGHT / 3
        );
        if (userType === UserType.Player) {
          // tell the player if they won or not
          if (frame.hasWon)
            draw_text(
              "You Won",
              "#00FF15",
              "45px Arcade Normal",
              WIDTH / 2 - 150,
              2 * (HEIGHT / 3)
            );
          else
            draw_text(
              "You Lost",
              "#FF0000",
              "45px Arcade Normal",
              WIDTH / 2 - 150,
              2 * (HEIGHT / 3)
            );
        }
        else {
          // tell the spectator who won
          draw_text(
            (frame.score.p1 > frame.score.p2 ? frame.score.username1 : frame.score.username2) + " Won",
            "#00FF15",
            "40px Arcade Normal",
            WIDTH / 2 - 150,
            2 * (HEIGHT / 3)
          );
        }

      }
    }
    draw();

  }, [frame, M_PADDLE_X, PADDLE_HEIGHT, R_PADDLE_X, userType]);
  if (frame.state === GameState.OVER) {
    delay(5000).then(() => {
      dispatch(cancelJoin());
      setframe({ ...initialState });
      navigate('/game');
    });
  }

  const leaveGame = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will lose your score!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD5454',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, leave!'
    }).then((result) => {
      if (result.isConfirmed) {
        socket.emit('leave_game');
        dispatch(cancelJoin());
        setframe({ ...initialState });
        navigate('/game');
      }
    })
  };

  return frame.state !== GameState.WAITING || userType === UserType.Spectator ?
    (
      <div className="game-bg flex flex-col justify-center items-center h-full w-full " >
        <div className="with_1100 flex flex-row items-center justify-between px-3 mb-3">
          <div className="flex flex-row items-center ">
            <img src={frame.score.image1} className="select-none pointer-events-none mr-3 object-cover object-center w-16 md:w-20 h-16 md:h-20 flex-none rounded-full border-2 border-gray-500 shadow-slate-500 shadow-xl" />
            <h2 className="text-xl font-semibold tracking-wider select-none game-username text-GameFontColor">{frame.score.username1}</h2>
          </div>
          <h1 className="h1 select-none text-GameFontColor"> Trans-Pong </h1>
          <div className="flex flex-row items-center">
            <h2 className="text-xl font-semibold tracking-wider select-none game-username text-GameFontColor">{frame.score.username2}</h2>
            <img src={frame.score.image2} className="select-none pointer-events-none ml-3 object-cover object-center w-16 md:w-20 h-16 md:h-20 flex-none rounded-full border-2 border-gray-500 shadow-slate-500 shadow-xl" />
          </div>
        </div>
        <canvas ref={Canvasref} className="mb-5" width={WIDTH} height={HEIGHT} />
        {
          (frame.state === GameState.PLAYING || frame.state === GameState.PAUSED) &&
          userType === UserType.Player &&
          <button
            onClick={leaveGame}
            className="button select-none flex px-6 pt-3 pb-2 bg-red-400 text-white rounded-full shadow-lg text-sm"
          >
            Leave
          </button>}
      </div>
    )
    :
    <WaitingGame />;
};

export default Game;
