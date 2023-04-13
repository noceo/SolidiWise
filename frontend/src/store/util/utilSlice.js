import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metamaskInstalled: false,
  metamaskConnected: false,
};

const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    setMetamaskInstalled: (state, action) => {
      state.metamaskInstalled = action.payload;
    },
    setMetamaskConnected: (state, action) => {
      state.metamaskConnected = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
  },
});

export const utilReducer = utilSlice.reducer;
export const { setMetamaskInstalled, setMetamaskConnected, setAccounts } = utilSlice.actions;
