import ExpenseListItem from "./ListItem";
import Spinner from "./Spinner";

const ExpenseList = (props) => {
  const expenses = props.expenses.map((expense, index) => <ExpenseListItem key={index} title={expense.title} />);

  if (props.loading) return <Spinner />;
  else return <div className="list-group">{expenses}</div>;
};

export default ExpenseList;
