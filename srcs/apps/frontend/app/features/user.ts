import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import api, { apiFormData } from "../../services/api";
import { RootState } from "../store";


export const checkLoginStatus = createAsyncThunk('user/checkLoginStatus',
    async (state, _api) => {
        try {
            let res = await api.get('/users/me');
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            return _api.rejectWithValue(error.message);
        }
    }
)

export const updateConnectedUser = createAsyncThunk(
    'auth/updateConnectedUser',
    async ({ username, twofa }: { username: string, twofa: boolean }, _api) => {
        try {
            let res = await api.put('/users', {
                displayName: username,
                enableTwoFactorAuth: twofa,
            });
            _api.fulfillWithValue(res.data);
            return res.data;
        } catch (error) {
            return _api.rejectWithValue(error.message)
        }
    }
)

export const updateUserAvatar = createAsyncThunk(
    'auth/updateUserAvatar',
    async ({ avatar }: { avatar: FormData }, _api) => {
        try {
            let res = await apiFormData.post('/users/avatar', avatar)
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message           
        }
    }
)

export const updateUser2fa = createAsyncThunk(
    'auth/updateUser2fa',
    async ({ twofa }: { twofa: boolean }, _api) => {
        try {
            let res = twofa ? await api.put('/users/enable-twofa') : await api.put('/users/disable-twofa')
            _api.fulfillWithValue(res.data)
            return res.data
        } catch (error) {
            _api.rejectWithValue(error.message)
            return error.message
        }
    }
)



const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        logged: false,
        status: 'loading'
    },
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
        },
        logout: (state, action) => {
            state.user = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(checkLoginStatus.fulfilled, (state, action) => {
            state.user = action.payload;
            state.logged = true;
            state.status = 'success';
        })

        builder.addCase(checkLoginStatus.rejected, (state, action) => {
            // if (Cookies.get('token'))
            //     Cookies.remove('token');
            state.logged = false;
            state.user = null;
            state.status = 'error';
        })

        // update display name
        builder.addCase(updateConnectedUser.fulfilled, (state, action) => {
            state.user = action.payload;
            // Cookies.set('user', JSON.stringify(action.payload));
            toast.success('profile updated')
        })

        builder.addCase(updateConnectedUser.rejected, (state, action) => {
            toast.error('Update profile failed');
        })

        // update avatar
        builder.addCase(updateUserAvatar.fulfilled, (state, action) => {
            state.user = action.payload;
            toast.success('Profile picture updated')
        })
        
        builder.addCase(updateUserAvatar.rejected, () => {
            // toast.error('Failed to update profile picture')
        })
        
        // // update 2fa
        // builder.addCase(updateUser2fa.fulfilled, (state, action) => {
        //     state.user = action.payload;
        //     Cookies.set('user', JSON.stringify(action.payload));
        //     toast.success('profile updated')
        // })
       
        // builder.addCase(updateUser2fa.rejected, (state, action) => {
        //     toast.success('Update profile failed')
        // })
    }
});

export const { login, logout } = userSlice.actions;
export const selectUser = (state: RootState) => state.user.user;
export default userSlice.reducer;