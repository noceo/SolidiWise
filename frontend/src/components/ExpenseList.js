import ExpenseListItem from "./ExpenseListItem";
import Spinner from "./Spinner";

const ExpenseList = (props) => {
  const expenses = props.expenses.map((expense, index) => <ExpenseListItem key={index} name={expense.name} />);

  if (props.loading) return <Spinner />;
  else return <div className="list-group">{expenses}</div>;
};

export default ExpenseList;
