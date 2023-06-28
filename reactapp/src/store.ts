import { PayloadAction, configureStore, createSlice } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { GeneralSummary } from "./models/Summary";
import { FullDistrict } from "./models/District";

const mainSlice = createSlice({
    name: 'main',
    initialState: {
        summary: [],
        districts: []
    } as IState,
    reducers: {
        setCountry: (state, action: PayloadAction<number | undefined>) => {
            state.selectedCountry = action.payload;
        },
        setSummary: (state, action: PayloadAction<GeneralSummary[]>) => {
            state.summary = action.payload;
        },
        setDistricts: (state, action: PayloadAction<FullDistrict[]>) => {
            state.districts = action.payload;
        },
    }
});

interface IState {
    selectedCountry?: number;
    summary: GeneralSummary[];
    districts: FullDistrict[];
}

export const store = configureStore({
    reducer: {
        main: mainSlice.reducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => AppDispatch = useDispatch;

export const { setCountry, setSummary, setDistricts } = mainSlice.actions;