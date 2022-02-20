import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { connect, Socket } from "socket.io-client";
import api, { url } from "../../services/api";
import { useAppSelector } from "../hooks";

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

export const banUser = createAsyncThunk('chat/banUser', 
    async ({ channelId, userId}: { channelId: number, userId: number}, _api) => {
        try {
            let res = await api.get(`/user-channels/ban/${channelId}/${userId}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message)
            return _api.rejectWithValue(error.message);
        }
    }
)

export const kickUser = createAsyncThunk('chat/kickUser', 
    async ({ channelId, userId}: { channelId: number, userId: number}, _api) => {
        try {
            let res = await api.delete(`/user-channels/kick/${channelId}/${userId}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message)
            return _api.rejectWithValue(error.message);
        }
    }
)




export const fetchChannelMessages = createAsyncThunk('chat/fetchChannelMessages',
    async ({ userId ,channelId }: { userId: number, channelId: number}, _api) => {
        try {
            let res = await api.get(`/messages/all-but-blocked/${channelId}/${userId}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message);
        }
    }
)

export const fetchAllChannelMessages = createAsyncThunk('chat/fetchAllChannelMessages',
    async ({ channelId }: { channelId: number}, _api) => {
        try {
            let res = await api.get(`/messages/${channelId}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message);
        }
    }
)

export const createChannel = createAsyncThunk('chat/createChannel',
    async (args: Channel, _api) => {
        try {
            let res = await api.post(`${url}/channels`, args);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message)
            return _api.rejectWithValue(error.message);
        }
    }
);

export const joinChannel = createAsyncThunk('chat/joinChannel',
    async ({ data, password }: { data: number, password: string }, _api) => {
        try {
            let res = await api.post(`/user-channels/${data}`, { password });
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message)
            return _api.rejectWithValue(error.message);
        }
    }
);

export const getAllChannels = createAsyncThunk('chat/getAllChannels',
    async (state, _api) => {
        try {
            let res = await api.get(`/user-channels/channels-notbelongto`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            return _api.rejectWithValue(error.message);
        }
    }
)

export const leaveChannel = createAsyncThunk('chat/leaveChannel',
    async ({ id }: { id: number}, _api) => {
        try {
            let res = await api.get(`/user-channels/leave/${id}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message);
            return error.message;
        }
    }
)

export const getUsersBelongsToChannel = createAsyncThunk('chat/getUsersBelongsToChannel',
    async ({ id }: { id: number }, _api)  => {
        try {
            let res = await api.get(`/user-channels/users_belongs_to/${id}`);
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            _api.rejectWithValue(error.message);
            return error.message;
        }
    }
)
export interface Idata {
    type: string;
    password?: string;
}

export const updateChannelVisibility = createAsyncThunk('chat/updateChannelVisibility',
    async ({ id, data }: {id: number, data: Idata}, _api) => {
        try {
            let res = await api.patch(`/channels/updatevisibility/${id}`, data);
            return _api.fulfillWithValue(res.data);
            // return res.data;
        }catch(error) {
            _api.rejectWithValue(error.message);
            return error.message;
        }
    }
)

// ================================================================================================================================================

export const muteUserInChannel = createAsyncThunk('/user-channels/mute',
    async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
        try {
            let res = await api.get(`/user-channels/mute/${channelId}/${userId}`)
            _api.fulfillWithValue(res.data)
            return (res.data)
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const unMuteUserInChannel = createAsyncThunk('/user-channels/unmute/', 
    async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
        try {
            let res = await api.get(`/user-channels/unmute/${channelId}/${userId}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const addAdminChannel = createAsyncThunk('/user-channels/add-admin/', 
    async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
        try {
            let res = await api.get(`/user-channels/add-admin/${channelId}/${userId}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const removeAdminChannel = createAsyncThunk('/user-channels/remove-admin/', 
    async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
        try {
            let res = await api.get(`/user-channels/remove-admin/${channelId}/${userId}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

interface Channel {
    id?: number;
    name: string;
    type: string;
    password?: string;
}

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        selectedId: -1,
        channels: [],
        channel: null,
        loading: false,
        allChannels: [],
        socket: null,
        messages: [],
        users: [],
        activeUserId: -1,
    },
    reducers: {
        initialUser: (state, action) => {
            state.activeUserId = action.payload
        },
        selectedChannel: (state, action: PayloadAction<number>) => {
            if (state.selectedId === action.payload)
                return;
            if (state.selectedId !== -1) {
                state.socket.emit('leave', state.selectedId)
            }
            state.selectedId = action.payload;
            state.channel = state.channels.find(c => c.id === state.selectedId);
            state.messages = [];
            // socket emit
            state.socket.emit('join', state.channel);
            // socket emit leave other channel
        },
        removeChannel: (state, { payload }) => {
            state.selectedId = -1;
            state.allChannels = state.allChannels.filter(chan => chan.id !== payload);
        },
        updateSocket: (state, action: PayloadAction<Socket>) => {
            state.socket = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        onOwnerLeaved: (state, action) => {
            if (state.selectedId == action.payload)
                state.selectedId = -1;
            state.channels = state.channels.filter(chan => chan.id !== action.payload);
            state.allChannels = state.allChannels.filter(chan => chan.id !== action.payload);
        },
        getBanned: (state, action) => {
            if (state.selectedId == action.payload)
                state.selectedId = -1;
            state.channels = state.channels.filter(chan => chan.id !== action.payload);
            state.allChannels = state.allChannels.filter(chan => chan.id !== action.payload);
        },
        getKicked: (state, action) => {
            if (state.selectedId == action.payload)
                state.selectedId = -1;
            const c = state.channels.find(chan => chan.id === action.payload.channelId);
            state.channels = state.channels.filter(chan => chan.id !== action.payload.channelId);
            state.allChannels.push(c);
            state.selectedId = -1
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllChannels.fulfilled, (state, action) => {
            state.loading = false;
            state.channels = action.payload;
        })
        builder.addCase(fetchAllChannels.pending, (state, action) => {
            state.loading = true;
            state.channels = [];
        })
        builder.addCase(fetchAllChannels.rejected, (state, action) => {
            state.loading = false;
            alert(action.payload);
        })

        // join channel
        builder.addCase(joinChannel.fulfilled, (state, action) => {
            // state.channels = [...state.channels, action.payload];
            state.allChannels = state.allChannels.filter(chan => chan.id !== action.payload.id);
            state.channels = state.channels.concat([action.payload]);
            // state.selectedId = action.payload.id
        })

        builder.addCase(joinChannel.rejected, (state, action) => {
            // state.channels = [];
            toast.error('password incorrect')
        })

        builder.addCase(getAllChannels.fulfilled, (state, action) => {
            state.allChannels = action.payload;
        });

        builder.addCase(getAllChannels.rejected, (state, action) => {
            alert(JSON.stringify(action.payload));
        });

        // leave channel emit leave
        builder.addCase(leaveChannel.fulfilled, (state, action) => {
            if (state.activeUserId !== -1 && state.activeUserId != action.payload.owner.id) {
                state.allChannels = state.allChannels.concat([action.payload]);
            } else {
                state.socket.emit('owner_leave', action.payload.id);
            }
            state.channels = state.channels.filter(chan => chan.id !== action.payload.id);
            state.channel = null;
            state.selectedId = -1;
        })

        builder.addCase(createChannel.fulfilled, (state, action) => {
            state.socket.emit('new', action.payload);
            state.channels.push(action.payload);
        })

        builder.addCase(createChannel.rejected, (state, action) => {
            toast.error('Creation of channel failed');
        })

        builder.addCase(fetchChannelMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        })

        builder.addCase(fetchAllChannelMessages.fulfilled, (state, action) => {
            state.messages = action.payload;
        })

        builder.addCase(banUser.fulfilled, (state, action) => {
            toast.success('User banned');
            state.socket.emit('ban_user_from_channel', {
                userId: action.payload[0].userId, channelId: action.payload[0].channelId }
            );
        });

        builder.addCase(banUser.rejected, (state, action) => {
            toast.error('You can\'t ban this user');
        });

        // users belong to a channel
        builder.addCase(getUsersBelongsToChannel.fulfilled, (state, action) => {
            state.users = action.payload;
        })

        builder.addCase(getUsersBelongsToChannel.rejected, (state, action) => {
            state.users = [];
        })

        // ======================================================================================================================

        builder.addCase(muteUserInChannel.rejected, (state, action) => {
            toast.error('failed to mute this user');
        });
        builder.addCase(unMuteUserInChannel.rejected, (state, action) => {
            toast.error('failed to unMute this user');
        });
        builder.addCase(addAdminChannel.rejected, (state, action) => {
            toast.error('failed to give admin rights');
        });
        builder.addCase(removeAdminChannel.rejected, (state, action) => {
            toast.error('failed to remove admin rights');
        });

        builder.addCase(kickUser.fulfilled, (state, action) => {
            toast.success("User kicked!")
            
            state.socket.emit('kick_user_from_channel', {
                userId: action.payload.userId, channelId: action.payload.channelId
            })
        })

        builder.addCase(kickUser.rejected, (state, action) => {
            toast.error('can\'t kick this user')
        })

        builder.addCase(updateChannelVisibility.fulfilled, (state, action) => {
            toast.success('channel updated');
            state.channel = action.payload;
        })
        builder.addCase(updateChannelVisibility.rejected, (state, action) => {
            toast.error('failed to update channel');
        })
    }
});

export default chatSlice.reducer;
export const { initialUser, selectedChannel, updateSocket, addMessage, onOwnerLeaved, getBanned, getKicked } = chatSlice.actions;