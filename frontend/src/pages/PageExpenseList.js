import { useLocation, useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";

const PageExpenseList = (props) => {
  const { id } = useParams();
  const location = useLocation();
  if (location.state === null) {
  }
  const { name, data } = location.state;

  return (
    <div className="container">
      <h2>{name}</h2>
      <ExpenseList expenses={data} />
    </div>
  );
};

export default PageExpenseList;
