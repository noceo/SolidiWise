import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accounts: [],
};

const utilSlice = createSlice({
  name: "util",
  initialState,
  reducers: {
    setAccounts: (state, action) => {
      state.accounts = action.payload;
    },
  },
});

export const utilReducer = utilSlice.reducer;
export const utilActions = utilSlice.actions;
