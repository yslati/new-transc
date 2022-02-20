import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api, { url } from "../../services/api";
import { Socket } from "socket.io-client";

export const fetchMessageById = createAsyncThunk('conversation/fetchMessage',
	async ({ id }: { id: number }, _api) => {
		try {
			let res = await api.get(`/conversation/${id}`);
			_api.fulfillWithValue(res.data);
			return res.data;
		} catch(err) {
			_api.rejectWithValue(err.message);
		}
	}
)

const directChatSlice = createSlice({
	name: 'directChat',
	initialState: {
		selectedId: -1,
		socket: null,
		loading: false,
		messages: []
	},
	reducers: {
		updateSocket: (state, action: PayloadAction<Socket>) => {
			state.socket = action.payload;
		},
		sendMessage: (state, action) => {
			state.socket.emit('newMsgHere', action.payload);
		},
		// addMessage: (state, action: PayloadAction<string>) => {
		// 	state.messages.push(action.payload);
		// }
	},
	extraReducers: (builder) => {
		builder.addCase(fetchMessageById.fulfilled, (state, action) => {
			state.messages = action.payload;
		})
	}
});

export const { updateSocket, sendMessage } = directChatSlice.actions;

export default directChatSlice.reducer;