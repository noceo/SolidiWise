import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import { getExpenseGroupById } from "../store/expenseGroup/expenseGroupSelectors";
import { fetchExpenseGroups } from "../store/expenseGroup/expenseGroupSlice";
import Spinner from "../components/Spinner";
import { initializeWallet } from "../network";
import Notes from "../components/Notes";

const PageExpenseList = (props) => {
  const { id } = useParams();
  const connected = useSelector((state) => state.util.metamaskConnected);
  const expenseGroup = useSelector(getExpenseGroupById(id));
  const dispatch = useDispatch();

  const initWallet = async () => {
    try {
      await initializeWallet();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (!connected) {
      initWallet();
    }
    if (connected) {
      dispatch(fetchExpenseGroups());
    }
  }, []);

  return (
    <div className="container">
      {expenseGroup ? (
        <>
          <h2>{expenseGroup.name}</h2>
          <p>Owner of this list: {expenseGroup.owner}</p>
          <ExpenseList expenses={expenseGroup.data} />
          <Notes notes={expenseGroup.notes} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default PageExpenseList;
