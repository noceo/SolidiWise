export const getExpenseGroupById = (id) => (store) => {
  return store.expenseGroup.data.find((group) => group.address === id);
};
