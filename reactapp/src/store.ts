import { configureStore, createSlice } from "@reduxjs/toolkit";

const mainSlice = createSlice({
    name: 'main',
    initialState: {} as IState,
    reducers: {

    }
});

interface IState {

}

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer
    }
});