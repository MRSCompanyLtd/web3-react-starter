import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface IConnectState {
    connected: boolean;
    address: string;
    chainId: number;
};

const initialState: IConnectState = {
    connected: false,
    address: '',
    chainId: 1
};

export const connectSlice = createSlice({
    name: 'connect',
    initialState,
    reducers: {
        makeConnection: (state: IConnectState, action: PayloadAction<IConnectState>) => {
            state.connected = action.payload.connected;
            state.address = action.payload.address;
            state.chainId = action.payload.chainId;
        },
        changeAccount: (state: IConnectState, action: PayloadAction<string>) => {
            state.address = action.payload;
        },
        changeChain: (state: IConnectState, action: PayloadAction<number>) => {
            state.chainId = action.payload;
        },
        reset: (state: IConnectState) => {
            localStorage.clear();
            state.connected = false;
            state.address = '';
        }
    }
});

export const { makeConnection, changeAccount, changeChain, reset } = connectSlice.actions;

export const selectConnect = (state: RootState) => state.connect;

export default connectSlice.reducer;