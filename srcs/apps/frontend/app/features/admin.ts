import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../services/api";

// admin
export const addAdmin = createAsyncThunk('admin/addAdmin',
	async ({ userId }: { userId:number }, _api) => {
		try {
			let res = await api.patch(`/admin/add-admin/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const removeAdmin = createAsyncThunk('admin/removeAdmin',
	async ({ userId }: { userId:number }, _api) => {
		try {
			let res = await api.patch(`/admin/remove-admin/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)


// users
export const getAllUsers = createAsyncThunk('admin/getAllUsers',
	async (state, _api) => {
		try {
			let res = await api.get('/admin/users')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const deleteUser = createAsyncThunk('admin/deleteUser', 
	async ({ userId }: { userId:number }, _api) => {
		try {
			let res = await api.delete(`admin/users/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const banUser = createAsyncThunk('admin/banUser', 
	async ({ userId }: { userId:number }, _api) => {
		try {
			let res = await api.patch(`admin/ban-user/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const undoBanUser = createAsyncThunk('admin/undoBanUser', 
	async ({ userId }: { userId:number }, _api) => {
		try {
			let res = await api.patch(`admin/undoban-user/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

// channels
export const getAllChannels = createAsyncThunk('admin/getAllChannels',
	async (state, _api) => {
		try {
			let res = await api.get('/admin/channels')
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const deleteChannel = createAsyncThunk('admin/deleteChannel',
	async ({ channelId }: { channelId: number }, _api) => {
		try {
			let res = await api.delete(`admin/channels/${channelId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

// user channels rights
export const addUserChannelRight = createAsyncThunk('admin/addUserChannelRight',
	async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
		try {
			let res = await api.patch(`admin/give-rights/${channelId}/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

export const deleteUserChannelRight = createAsyncThunk('admin/deleteUserChannelRight',
	async ({ channelId, userId }: { channelId: number, userId: number }, _api) => {
		try {
			let res = await api.patch(`admin/remove-rights/${channelId}/${userId}`)
			_api.fulfillWithValue(res.data)
			return res.data
		} catch (error) {
			_api.fulfillWithValue(error.message)
			return error.message
		}
	}
)

const adminSlice = createSlice({
	name: 'admin',
	initialState: {
		users: [],
		channels: []
	},
	reducers: {

	},
	extraReducers: (builder) => {
		// add Admin
		builder.addCase(addAdmin.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(addAdmin.rejected, (state, action) => {
			toast.error('failed to add website admin')
		})

		// remove admin
		builder.addCase(removeAdmin.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(removeAdmin.rejected, (state, action) => {
			toast.error('failed to remove website admin')
		})

		// get all users
		builder.addCase(getAllUsers.fulfilled, (state, action) => {
			state.users = action.payload
		})
		builder.addCase(getAllUsers.rejected, (state, action) => {
			toast.error('failed to get all users for admin')
		})



		// delete user
		builder.addCase(deleteUser.fulfilled, (state, action) => {
			state.users = state.users.filter(user => user.id !== action.payload.id);
		})
		builder.addCase(deleteUser.rejected, (state, action) => {
			toast.error('failed to delete this user')
		})

		// ban user
		builder.addCase(banUser.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(banUser.rejected, (state, action) => {
			toast.error('failed to ban this user')
		})

		// undoban user
		builder.addCase(undoBanUser.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(undoBanUser.rejected, (state, action) => {
			toast.error('failed to undoBan this user')
		})

		// get all channels
		builder.addCase(getAllChannels.fulfilled, (state, action) => {
			state.channels = action.payload
		})
		builder.addCase(getAllChannels.rejected, (state, action) => {
			toast.error('failed to get all channels for admin')
		})

		// delete channel
		builder.addCase(deleteChannel.fulfilled, (state, action) => {
			state.channels = state.channels.filter(channel => channel.id !== action.payload.id);
		})
		builder.addCase(deleteChannel.rejected, (state, action) => {
			toast.error('failed to delete this channel')
		})

		// add user rights to channel
		builder.addCase(addUserChannelRight.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(addUserChannelRight.rejected, (state, action) => {
			toast.error('failed to add user rights to this channel')
		})

		// delete user rights to channel
		builder.addCase(deleteUserChannelRight.fulfilled, (state, action) => {
			// state.users = action.payload
		})
		builder.addCase(deleteUserChannelRight.rejected, (state, action) => {
			toast.error('failed to delete user rights to this channel')
		})
	}
})

export default adminSlice.reducer