import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";
import { network } from "../../network";

const initialState = {
  loading: false,
  address: "",
  error: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.address = action.payload;
      state.error = "";
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.address = "";
      state.error = action.error.message;
    });
  },
});

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const accounts = await network.eth.getAccounts();
  console.log("FETCH", accounts);
  return accounts[0];
});

export const userReducer = userSlice.reducer;
