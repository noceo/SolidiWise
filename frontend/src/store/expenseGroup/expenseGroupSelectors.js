export const selectExpenseGroupById = (state, id) => {
  // console.log(store.expenseGroup.data);
  if (state.expenseGroup.data) {
    return state.expenseGroup.data.find((group) => group.address === id);
  }
};
