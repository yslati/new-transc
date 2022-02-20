import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api from "../../services/api";

export const getAllUsers = createAsyncThunk(
	'users/getAllUsers',
	async (state, _api) => {
		try {
			let res = await api.get('/users/friends-noRelation')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.rejectWithValue(error.message)
			return error.message
		}
	}
)

export const getUserById = createAsyncThunk(
	'users/getUserById',
	async ({ userId }: { userId: number }, _api) => {
		try {
			let res = await api.get(`/users/profile/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.rejectWithValue(error.message)
			return error.message
		}
	}
)

export const getPendingUsers = createAsyncThunk(
	'users/getPendingUsers',
	async (state, _api) => {
		try {
			let res = await api.get('/users/friends-pending')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.rejectWithValue(error.message)
			return error.message
		}
	}
)

export const getFriendsUsers = createAsyncThunk(
	'users/getFriendsUsers',
	async (state, _api) => {
		try {
			let res = await api.get('/users/friends-accepted')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.rejectWithValue(error.message)
			return error.message
		}
	}
)

export const getBannedUsers = createAsyncThunk(
	'users/getBannedUsers',
	async (state, _api) => {
		try {
			let res = await api.get('/users/blocked-friends')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.rejectWithValue(error.message)
			return error.message
		}
	}
)


// friend request
export const sendFriendRequest = createAsyncThunk(
    'auth/sendFriendRequest',
    async ({ id }: { id: number }, _api) => {
        try {
            let res = await api.post(`/users/${id}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const acceptFriendRequest = createAsyncThunk(
    'auth/acceptFriendRequest',
    async ({ id }: { id: string }, _api) => {
        try {
            let res = await api.patch(`/users/${id}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const blockUserUsers = createAsyncThunk(
    'users/blockUserUsers',
    async ({ id }: { id: string }, _api) => {
        try {
            let res = await api.post(`/users/block/${id}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const getLeaderboard = createAsyncThunk(
    'users/getLeaderboard',
    async (state, _api) => {
        try {
            let res = await api.get(`/users/leaderboard`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const getBlockedUsers = createAsyncThunk(
    'users/getBlockedUsers',
    async (state, _api) => {
        try {
            let res = await api.get(`/users/blocked-users`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)

export const cancelInvitation = createAsyncThunk(
    'users/cancelInvitation',
    async ({ id }: { id: number }, _api) => {
        try {
			let res = await api.get(`/users/cancel_invitation/${id}`)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)


const usersSlice = createSlice({
	name: 'users',
	initialState: {
		users: [],
		friends: [],
		pending: [],
		blocked: [],
		leaderboard: [],
		userProfile: null,
	},
	reducers: {
		// when the server emit a connected user
		connectedUser: (state, action) => {
			state.friends = state.friends.map(friend => {
				friend.status = friend.id === action.payload ? "online" : friend.status;
				return friend;
			});

			state.users = state.users.map(user => {
				user.status = user.id === action.payload ? "online" : user.status;
				return user;
			});

			state.pending = state.pending.map(user => {
				user.status = user.id === action.payload ? "online" : user.status;
				return user;
			});
		},
		disconnectedUser: (state, action) => {
			state.friends = state.friends.map(friend => {
				friend.status = friend.id === action.payload ? "offline" : friend.status;
				return friend;
			});

			state.users = state.users.map(user => {
				user.status = user.id === action.payload ? "offline" : user.status;
				return user;
			});

			state.pending = state.pending.map(user => {
				user.status = user.id === action.payload ? "offline" : user.status;
				return user;
			});
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getAllUsers.fulfilled, (state, action) => {
			state.users = action.payload
		})
		
		builder.addCase(getAllUsers.rejected, (state, action) => {
			toast.error('failed to get all users');
		})

		builder.addCase(getFriendsUsers.fulfilled, (state, action) => {
			state.friends = action.payload;
		});

		builder.addCase(getFriendsUsers.rejected, (state, action) => {
			toast.error('failed to get user friends');
		})

		builder.addCase(sendFriendRequest.fulfilled, (state, action) => {
			state.users = state.users.filter(user => user.id !== action.payload.recipient.id);
			state.pending.push(action.payload.recipient);
		})

		builder.addCase(getPendingUsers.fulfilled, (state, action) => {
			state.pending = action.payload;
		})

		builder.addCase(getUserById.fulfilled, (state, action) => {
			const res = JSON.stringify(action.payload)
			res === "Request failed with status code 404" ?
				state.userProfile = {} :
				state.userProfile = action.payload
		})
		builder.addCase(getUserById.rejected, (state, action) => {
			state.userProfile = {}
		})

		builder.addCase(acceptFriendRequest.fulfilled, (state, action) => {
			state.friends.push(action.payload);
			state.pending = state.pending.filter(user => user.id !== action.payload.id)
		})

		builder.addCase(blockUserUsers.fulfilled, (state, action) => {
			state.friends = state.friends.filter(user => user.id !== action.payload.id);
			state.users = state.users.filter(user => user.id !== action.payload.id);
			state.pending = state.pending.filter(user => user.id !== action.payload.id);
			toast.success('blocked from your world');
		});
		builder.addCase(blockUserUsers.rejected, (state, action) => {
			toast.error('You can not block this user');
		});

		builder.addCase(getLeaderboard.fulfilled, (state, action) => {
			state.leaderboard = action.payload
		})
		builder.addCase(getLeaderboard.rejected, (state, action) => {
			state.leaderboard = []
			toast.error('failed to get leaderboard')
		})

		builder.addCase(getBlockedUsers.fulfilled, (state, action) => {
			state.blocked = action.payload;
		})
		builder.addCase(getBlockedUsers.rejected, (state, action) => {
			state.blocked = [];
			toast.error('failed to get blocked users')
		})

		builder.addCase(cancelInvitation.fulfilled, (state, action) => {
			state.pending = state.pending.filter(user => user.id !== action.payload.id)
		})

		builder.addCase(cancelInvitation.rejected, (state, action) => {
			toast.error('failed to perform this action');
		})
	}
})

export default usersSlice.reducer;

export const { connectedUser, disconnectedUser } = usersSlice.actions;