import Button from "react-bootstrap/esm/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ExpenseListItem = (props) => {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return (
    <div className="list-group-item list-group-item-action d-flex justify-content-between w-50" aria-current="true" data-id={props.id}>
      <div>
        <h5>{props.name}</h5>
        <p>
          {props.spender.substring(0, 6)}... paid {USDollar.format(props.amount / 100)}
        </p>
        {props.borrowLentInfo}
      </div>
      <div className="my-auto">
        <Button className="btn btn-danger" onClick={() => props.handleDeleteExpense(props.id)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    </div>
  );
};

export default ExpenseListItem;
