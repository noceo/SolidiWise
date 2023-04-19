import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { store } from "../store";
import { EXPENSE_LIST_ABI } from "../../config";

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
    builder.addCase(fetchExpensesForGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchExpensesForGroup.fulfilled, (state, action) => {
      state.loading = false;
      const groupIndex = state.data.findIndex((group) => group.address === action.meta.arg);
      const newObject = { ...state.data[groupIndex], expenses: action.payload };
      console.log("NEW_OBJECT", newObject);
      state.data[groupIndex] = { ...state.data[groupIndex], expenses: action.payload };
      state.error = "";
    });
    builder.addCase(fetchExpensesForGroup.rejected, (state, action) => {
      state.loading = false;
      state.data = "";
      state.error = action.error.message;
    });
  },
});

export const fetchExpenseGroups = createAsyncThunk("expenseGroup/fetchExpenseGroups", async () => {
  const currentAccount = store.getState().user.currentAccount;
  let expenseLists = await window.metamask.expenseListFactory.methods.getExpenseLists().call({ from: currentAccount });
  expenseLists = await expenseLists.map(async (address) => {
    const contract = new window.metamask.eth.Contract(EXPENSE_LIST_ABI, address);
    const name = await contract.methods.getName().call();
    let owner = await contract.methods.getOwner().call();
    owner = owner.toLowerCase();
    let participants = await contract.methods.getParticipants().call();
    participants = participants.map((address) => address.toLowerCase());
    const notes = await contract.methods.getNotes().call();
    window.contracts[address] = contract;
    registerExpenseListEventHandlers(contract);

    return {
      name,
      address,
      owner,
      participants,
      notes,
    };
  });

  expenseLists = await Promise.all(expenseLists);
  console.log("FETCHED_LISTS", expenseLists);
  return expenseLists;
});

export const fetchExpensesForGroup = createAsyncThunk("expenseGroup/fetchExpensesForGroup", async (address) => {
  const contract = window.contracts[address];
  let expenseCount = 0;
  try {
    expenseCount = await contract.methods.getExpenseCount().call();
    expenseCount = Number(expenseCount);
  } catch (error) {
    throw error;
  }

  if (expenseCount === 0) return [];

  let expenses = [...Array(expenseCount).keys()].map(async (index) => {
    const expense = await contract.methods.getExpenseAtIndex(index).call();
    // console.log(expense);
    return {
      id: expense[0],
      name: expense[1],
      amount: Number(expense[2]),
      spender: expense[3].toLowerCase(),
      debtors: expense[4].map((address) => address.toLowerCase()),
      debtAmounts: expense[5].map((amount) => Number(amount)),
      notes: expense[6],
    };
  });

  expenses = Promise.all(expenses);
  console.log("FETCHED_EXPENSES", expenses);
  return expenses;
});

const registerExpenseListEventHandlers = (contract) => {
  contract.events
    .LogNewExpense()
    .on("connected", (message) => console.log("ADD_EXPENSE_HANDLER_CONNECTED: ", message))
    .on("data", (event) => {
      console.log("EXPENSE_ADDED", event);
      // const payload = event.returnValues;
      // console.log("EXPENSELIST_CREATE_EVENT: ", event);
      // const currentAccount = store.getState().user.currentAccount;
      // console.log("CONDITION", payload.owner, currentAccount, payload.participants);
      // if (payload.owner === currentAccount || payload.participants.includes(currentAccount)) {
      //   console.log("ADD EXPENSE GROUP");
      //   store.dispatch(addExpenseGroup(payload.expenseList));
      // }
    })
    .on("error", (error) => console.error("ADD_EXPENSE_ERROR", error));
};

export const expenseGroupReducer = expenseGroupSlice.reducer;
export const { addExpenseGroup, removeExpenseGroup } = expenseGroupSlice.actions;
