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
  // extraReducers: (builder) => {
  //   builder.addCase(fetchUser.pending, (state) => {
  //     state.loading = true;
  //   });
  //   builder.addCase(fetchUser.fulfilled, (state, action) => {
  //     state.loading = false;
  //     state.currentAccount = action.payload;
  //     state.error = "";
  //   });
  //   builder.addCase(fetchUser.rejected, (state, action) => {
  //     state.loading = false;
  //     state.currentAccount = "";
  //     state.error = action.error.message;
  //   });
  // },
});

// export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
//   const accounts = await window.metamask.eth.getAccounts();
//   console.log("FETCH", accounts);
//   return accounts[0];
// });

export const userReducer = userSlice.reducer;
export const { setCurrentAccount } = userSlice.actions;
