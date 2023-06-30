import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { FullDistrict } from "../models/District";
import { GeneralSummary } from "../models/Summary";

export const mainSlice = createSlice({
    name: 'main',
    initialState: {
        summary: [],
        districts: [],
        types: []
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
        setTypes: (state, action: PayloadAction<string[]>) => {
            state.types = action.payload;
        },
        setUsername: (state, action: PayloadAction<string | undefined>) => {
            state.username = action.payload;
        }
    }
});

interface IState {
    selectedCountry?: number;
    summary: GeneralSummary[];
    districts: FullDistrict[];
    types: string[];
    username?: string;
}

export const { setCountry, setSummary, setDistricts, setTypes, setUsername } = mainSlice.actions;