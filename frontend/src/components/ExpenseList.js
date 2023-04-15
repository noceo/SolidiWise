import ExpenseListItem from "./ExpenseListItem";
import Spinner from "./Spinner";

const ExpenseList = (props) => {
  const expenses = props.expenses ? props.expenses.map((expense, index) => <ExpenseListItem key={index} name={expense.name} />) : <h4>No expenses at the moment. You're good to go.</h4>;

  if (props.loading) return <Spinner />;
  else return <div className="list-group">{expenses}</div>;
};

export default ExpenseList;
