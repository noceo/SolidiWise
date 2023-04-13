import { useLocation, useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";

const PageExpenseList = (props) => {
  const { id } = useParams();
  const location = useLocation();
  console.log(location.state);
  const { name, data } = location.state;

  return (
    <div className="container">
      <h2>{name}</h2>
      <ExpenseList expenses={data} />
    </div>
  );
};

export default PageExpenseList;
