import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";

const initialState = {
  loading: false,
  data: [],
  error: "",
  // {
  //   id: 1,
  //   name: "Group 1",
  //   owner: "0x0",
  //   participants: [],
  //   data: [1, 2, 3],
  // },
  // {
  //   id: 2,
  //   name: "Group 2",
  //   owner: "0x0",
  //   participants: [],
  //   data: [1, 2, 3],
  // },
  // {
  //   id: 3,
  //   name: "Group 3",
  //   owner: "0x0",
  //   participants: [],
  //   data: [1, 2, 3],
  // },
};

const expenseGroupSlice = createSlice({
  name: "expenseGroup",
  initialState,
  reducers: {
    addExpenseGroup: (state, action) => {
      state.data = [...state.data, action.payload];
    },
    removeExpenseGroup: (state, action) => {
      console.log("REMOVED EXPENSE GROUP");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchExpenseGroups.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExpenseGroups.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = "";
    });
    builder.addCase(fetchExpenseGroups.rejected, (state, action) => {
      state.loading = false;
      state.data = "";
      state.error = action.error.message;
    });
  },
});

export const fetchExpenseGroups = createAsyncThunk("expenseGroup/fetchExpenseGroups", async () => {
  const currentAccount = store.getState().user.currentAccount;
  return await window.metamask.expenseListFactory.methods.getExpenseLists().call({ from: currentAccount });
});

export const expenseGroupReducer = expenseGroupSlice.reducer;
export const { addExpenseGroup, removeExpenseGroup } = expenseGroupSlice.actions;
