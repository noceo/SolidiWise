import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../assets/styles/ExpenseGroupList.css";
import Spinner from "./Spinner";

const ExpenseGroupList = (props) => {
  const loading = useSelector((state) => state.expenseGroup.loading);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ListGroup className="expense-group-list mb-4">
          {props.listItems.map((expenseGroup, index) => {
            return (
              <ListGroup.Item key={index} className="p-0">
                <Link to={"/lists/" + expenseGroup.address} state={expenseGroup} className="list-group-item list-group-item-action border-0" aria-current="true">
                  {expenseGroup.name}
                </Link>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
};

export default ExpenseGroupList;
