import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ExpenseListItem from "./ExpenseListItem";
import Spinner from "./Spinner";

const ExpenseList = (props) => {
  console.log("expenses", props.expenses);
  let expenses = [];
  if (props.expenses && props.expenses.length > 0) {
    expenses = props.expenses.map((expense, index) => <ExpenseListItem key={index} name={expense.name} />);
  } else {
    expenses = <h4>No expenses at the moment. You're good to go.</h4>;
  }

  if (props.loading) return <Spinner />;
  else
    return (
      <>
        <ListGroup className="expense-group-list mb-4">{expenses}</ListGroup>
        {/* <Button type="button" onClick={}>Create new Expense</Button> */}
      </>
    );
};

export default ExpenseList;
