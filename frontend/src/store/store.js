import { configureStore } from "@reduxjs/toolkit";
import { utilReducer } from "./util/utilSlice";
import { userReducer } from "./user/userSlice";
import { expenseGroupReducer } from "./expenseGroup/expenseGroupSlice";

export const store = configureStore({
  reducer: {
    util: utilReducer,
    user: userReducer,
    expenseGroup: expenseGroupReducer,
  },
});
