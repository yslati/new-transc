import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../services/api";

export const fetchAllChannels = createAsyncThunk('chat/fetchAllChannels', 
    async (state, _api) => {
        try {
            let res = await api.get('/user-channels/channels-belongto');
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message);
        }
    }
)

const channelsSlice = createSlice({
    name: 'channel',
    initialState: {
        channels: []
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllChannels.fulfilled, (state, action) => {
            state.channels = action.payload;
        });

        builder.addCase(fetchAllChannels.rejected, (state, action) => {
            toast.error('failed to get all channels');
        });
    }
})