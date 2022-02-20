import { createSlice } from "@reduxjs/toolkit";

const globalSlice = createSlice({
    name: 'globalState',
    initialState: {
        refresh: false
    },
    reducers: {
        updateRefresh: (state) => {
            state.refresh = !state.refresh
        }
    }
});

export default globalSlice.reducer;
export const { updateRefresh } = globalSlice.actions;