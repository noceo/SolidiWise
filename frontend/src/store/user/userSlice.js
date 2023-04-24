import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";
import { network } from "../../network";

const initialState = {
  loading: false,
  currentAccount: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload;
    },
  },
});

export const userReducer = userSlice.reducer;
export const { setCurrentAccount } = userSlice.actions;
