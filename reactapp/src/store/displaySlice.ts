import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const displaySlice = createSlice({
    name: 'display',
    initialState: {
        loginDialog: false
    } as IState,
    reducers: {
        setLoginDialog: (state, action: PayloadAction<boolean>) => {
            state.loginDialog = action.payload;
        }
    }
});

interface IState {
    loginDialog: boolean;
}

export const { setLoginDialog } = displaySlice.actions;