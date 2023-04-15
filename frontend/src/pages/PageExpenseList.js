import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import { selectExpenseGroupById } from "../store/expenseGroup/expenseGroupSelectors";
import { fetchExpensesForGroup } from "../store/expenseGroup/expenseGroupSlice";
import Spinner from "../components/Spinner";
import { initializeWallet } from "../network";
import Notes from "../components/Notes";
import { store } from "../store/store";

const PageExpenseList = (props) => {
  const { id } = useParams();
  const connected = useSelector((state) => state.util.metamaskConnected);
  const expenseGroup = useSelector((state) => selectExpenseGroupById(state, id));
  const dispatch = useDispatch();

  useEffect(() => {
    const initWallet = async () => {
      try {
        console.log("INIT_WALLET");
        await initializeWallet();
      } catch (error) {
        console.error(error);
      }
      console.log("FINISH");
    };

    console.log("USE_EFFECT", expenseGroup);
    if (!connected) {
      initWallet().then(() => {
        const expenseGroup = store.getState().expenseGroup.data.find((group) => group.address === id);
        console.log("AFTER_INIT", expenseGroup);
        if (expenseGroup) {
          dispatch(fetchExpensesForGroup(expenseGroup.address));
        }
      });
    }
  }, []);

  return (
    <div className="container">
      {expenseGroup !== undefined ? (
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
