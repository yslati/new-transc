import React, {useRef , useEffect, useState} from 'react';
import {io} from 'socket.io-client';
import logo from './logo.svg';
import {useSocket} from '../../providers/SocketProvider';
import Swal from "sweetalert2";
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router';
import { cancelJoin } from "../../app/features/game";

const WIDTH = 1100;
const HEIGHT = 600;
const PADDLE_HEIGHT = HEIGHT / 6;
const PADDLE_WIDTH = 20;
const L_PADDLE_X = 0;
const R_PADDLE_X = WIDTH - PADDLE_WIDTH;
const MIDDLE_PADDLE_INIT_Y = HEIGHT - PADDLE_HEIGHT - PADDLE_WIDTH / 2;
const PADDLE_INIT_Y = HEIGHT / 2 - PADDLE_HEIGHT / 2;
const M_PADDLE_X = WIDTH / 2 - PADDLE_WIDTH / 2;

class Circle
{
	_ctx: CanvasRenderingContext2D;
	_x: number;
	_y: number;
	_r: number;
	_color: string;

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number,
		r: number, color: string)
	{
		this._ctx = ctx;
		this._x = x;
		this._y = y;
		this._r = r;
		this._color = color;
	}
	draw()
	{
		this._ctx.beginPath();
		this._ctx.fillStyle = this._color;
		this._ctx.arc(this._x, this._y, this._r, 0, Math.PI * 2);
		this._ctx.fill();
		this._ctx.closePath();
	}
}

class Ball extends Circle
{
}

class Rect
{
	_ctx: CanvasRenderingContext2D;
	_x: number;
	_y: number;
	_width: number;
	_height: number;
	_color: string;

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number,
		width: number, height: number, color: string)
	{
		this._ctx = ctx;
		this._x = x;
		this._y = y;
		this._width = width;
		this._height = height;
		this._color = color;
	}
	draw()
	{
		this._ctx.beginPath();
		this._ctx.fillStyle = this._color;
		this._ctx.rect(this._x, this._y, this._width, this._height);
		this._ctx.fill();
		this._ctx.closePath();
	}
}

class Paddle extends Rect
{
	drawWithCircle()
	{
		const upCircle = new Circle(this._ctx, this._x + PADDLE_WIDTH / 2,
			this._y, PADDLE_WIDTH / 2, this._color);
		const downCircle = new Circle(this._ctx, this._x + PADDLE_WIDTH / 2,
			this._y + PADDLE_HEIGHT, PADDLE_WIDTH / 2, this._color);

		this.draw();
		upCircle.draw();
		downCircle.draw();
	}
}

const enum GameState
{
	WAITING,
	STARTING,
	PLAYING,
	PAUSED,
	OVER
}

interface IFrame
{
	ball: {x: number, y: number},
		paddles: {ly: number, ry: number, my?: number},
		score: {
    		p1: number,
    		username1: string,
    		image1: string,
    		p2: number,
    		username2: string,
    		image2: string,
		}
	state: GameState,
	hasMiddlePaddle: boolean,
	hasWon: boolean,
	startingSecond?: number,
	message?: string
}

function Watch()
{
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const socket = useSocket(); 
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const initialState = 
		{
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
			hasWon: false
		};
	const [frame, setFrame] = useState<IFrame>(initialState);
  	const { state } = useLocation();
	

	const gameOver = function (ctx: CanvasRenderingContext2D, text: string)
	{
		
		ctx.beginPath();
		ctx.font = '30px game-font';
		ctx.fillStyle = 'black';
		
		const metrics = ctx.measureText(text);
		
		ctx.fillText(text, (WIDTH/2) - (metrics.width / 2), 50);	
		ctx.closePath();
	}

	useEffect(function (){
		socket.on("state", function (newFrame : any)
		{
			setFrame(newFrame);
		});
		return (() => {
			socket.off("state")
		});
	}, [socket]);

	useEffect(function ()
		{
			if (!state)
				navigate("/liveGames");
    	socket.emit("spectator", state);
    	socket.off("spectator");
	}, [])

	useEffect(function ()
		{
			if (canvasRef == null)
			{
				return;
			}
			const canvas = canvasRef.current;
			const ctx = (canvas != null) ? canvas.getContext('2d') : null;

			if (ctx != null && frame.state != GameState.WAITING && frame.state
				!= GameState.OVER)
			{
				if (canvas)
					canvas.style.display = "block";

				const background = new Rect(ctx, 0, 0, ctx.canvas.width,
					ctx.canvas.height, "rgb(84 209 136)");

				background.draw();

				const paddleLeft = new Paddle(ctx, L_PADDLE_X, frame.paddles.ly,
					PADDLE_WIDTH, PADDLE_HEIGHT, "rgb(25 109 180)");
				const paddleRight = new Paddle(ctx, R_PADDLE_X,
					frame.paddles.ry,
					PADDLE_WIDTH, PADDLE_HEIGHT, "black");
				const ball = new Ball(ctx,  frame.ball.x, frame.ball.y
					, 10, "black");

				paddleLeft.drawWithCircle();
				paddleRight.drawWithCircle();
				ball.draw();

				if (frame.hasMiddlePaddle == true)
				{ 
					const paddleMiddle = new Paddle(ctx, M_PADDLE_X,
						frame.paddles.my, PADDLE_WIDTH, PADDLE_HEIGHT
						, "rgb(25 109 180)");

					paddleMiddle.drawWithCircle();
				}
			}
			else if (frame.state == GameState.WAITING)
			{
				if (canvas)
					canvas.style.display = "none";	
			}
			else if (ctx != null && frame.state == GameState.OVER)
			{
				const background = new Rect(ctx, 0, 0, ctx.canvas.width,
					ctx.canvas.height, "rgb(84 209 136)");

				background.draw();
				if (frame.p1 > frame.p2)
					gameOver(ctx, frame.score.username1 + " WON");
				else
					gameOver(ctx, frame.score.username2 + " WON");
				setTimeout(() =>
					{
      					dispatch(cancelJoin());
						setFrame({...initialState})
      					navigate('/liveGames');
					}, 3000);
			}
		}, [frame]);
		
	return (
		<div>
          <div className="container board">
             { (frame.state != GameState.WAITING) ?
             <div className="container board-wrap">
                <div className="board-info">
                   <span>{frame.score.username1}</span>
                   <span>{frame.score.p1}</span>
                </div>
                <div className="board-info">
                   <span>{frame.score.username2}</span>
                   <span>{frame.score.p2}</span>
                </div>
             </div>
             : ""}
          </div>
          <canvas className="my-canvas" width={WIDTH} 
		height={HEIGHT} ref={canvasRef}/>
       </div>
	);
}

export default Watch;
