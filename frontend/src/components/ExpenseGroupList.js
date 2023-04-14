import ListGroup from "react-bootstrap/ListGroup";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../assets/styles/ExpenseGroupList.css";
import Spinner from "./Spinner";

const ExpenseGroupList = (props) => {
  const loading = useSelector((state) => state.expenseGroup.loading);
  console.log("CHILD", props);
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <ListGroup className="expense-group-list mb-4">
          {props.listItems.map((item, index) => {
            return (
              <ListGroup.Item key={index} className="p-0">
                <Link to={"/lists/" + item} state={item} className="list-group-item list-group-item-action border-0" aria-current="true">
                  {item}
                </Link>
              </ListGroup.Item>
            );
          })}
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <a href="#" className="list-group-item list-group-item-action border-0" aria-current="true">
              Test
            </a>
          </ListGroup.Item>
        </ListGroup>
      )}
    </>
  );
};

export default ExpenseGroupList;
