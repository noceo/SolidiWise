import { createSlice } from "@reduxjs/toolkit";

const initialState = [
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
];

const expenseGroupSlice = createSlice({
  name: "expenseGroup",
  initialState,
  reducers: {
    set: (state, action) => {
      state.expenseGroups = action.payload;
    },
    add: (state, action) => {
      state.expenseGroups = [...state.expenseGroups, action.payload];
    },
    remove: (state, action) => {
      console.log("REMOVED EXPENSE GROUP");
    },
  },
});

export const expenseGroupReducer = expenseGroupSlice.reducer;
export const expenseGroupActions = expenseGroupSlice.actions;
