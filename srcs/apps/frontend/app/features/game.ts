import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "../../services/api";

export interface GameInfo {
	score1: number;
	username1: string;
	image1: string;
	score2: number;
	username2: string;
	image2: string;
	type: string;
	userId?: number;
	winnerId?: number;
}

export const getGamesHistory = createAsyncThunk(
	'game',
	async ({ id }: { id: number }, _api): Promise<GameInfo[]> => {
		try {
			let res = await api.get(`game/history/${id}`);
			_api.fulfillWithValue(res.data);
			return res.data;
		} catch (err) {
			_api.rejectWithValue(err.message);
		}
	}
)


const history = createSlice({
	name: 'game',
	initialState: {
		games: [] as GameInfo[],
		joined: false,
	},
	reducers: {
		updateGames: (state, action: PayloadAction<any>) => {
			state.games = action.payload;
		},
		joinGame: (state) => {
			state.joined = true;
		},
		cancelJoin: (state) => {
			state.joined = false;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getGamesHistory.fulfilled, (state, action) => {
			state.games = action.payload;
		});

		builder.addCase(getGamesHistory.rejected, () => {
			toast.error('failed to get all your games history');
		});
	}
});

export default history.reducer;

export const { updateGames, joinGame, cancelJoin } = history.actions;