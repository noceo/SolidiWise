export const selectExpenseGroupById = (state, id) => {
  if (state.expenseGroup.data) {
    return state.expenseGroup.data.find((group) => group.address === id);
  }
};
