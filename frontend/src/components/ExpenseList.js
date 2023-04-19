import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ExpenseListItem from "./ExpenseListItem";
import Spinner from "./Spinner";

const ExpenseList = (props) => {
  let expenses = [];
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  if (props.expenses && props.expenses.length > 0) {
    expenses = props.expenses.map((expense, index) => {
      let borrowLentInfo;
      let debtorIndexForUser = expense.debtors.indexOf(props.user.currentAccount);

      if (props.user.currentAccount === expense.spender) {
        let lentAmount = expense.debtAmounts.reduce((partialSum, amount) => partialSum + amount, 0);
        lentAmount -= expense.debtAmounts[debtorIndexForUser];
        borrowLentInfo = <p className="text-success">you lent {USDollar.format(lentAmount / 100)}</p>;
      } else if (debtorIndexForUser !== -1) {
        const borrowAmount = expense.debtAmounts[debtorIndexForUser];
        borrowLentInfo = borrowAmount > 0 && <p className="text-danger">you borrowed {USDollar.format(borrowAmount / 100)}</p>;
      }
      return <ExpenseListItem key={index} name={expense.name} amount={expense.amount} spender={expense.spender} borrowLentInfo={borrowLentInfo} />;
    });
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
