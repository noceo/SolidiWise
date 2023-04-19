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
  },
});

export const utilReducer = utilSlice.reducer;
export const { setMetamaskInstalled, setMetamaskConnected, setModal } = utilSlice.actions;
