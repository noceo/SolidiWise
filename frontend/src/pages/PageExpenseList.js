import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ExpenseList from "../components/ExpenseList";
import { selectExpenseGroupById } from "../store/expenseGroup/expenseGroupSelectors";
import { fetchExpensesForGroup } from "../store/expenseGroup/expenseGroupSlice";
import Spinner from "../components/Spinner";
import { initializeWallet } from "../network";
import Notes from "../components/Notes";
import { store } from "../store/store";
import Button from "react-bootstrap/Button";
import AddExpenseModal from "../components/AddExpenseModal";

const PageExpenseList = (props) => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const connected = useSelector((state) => state.util.metamaskConnected);
  const expenseGroup = useSelector((state) => selectExpenseGroupById(state, id));
  const loading = useSelector((state) => state.expenseGroup.loading);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalSubmit, setModalSubmit] = useState("");

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = (modalHeader, modalSubmit) => {
    setModalHeader(modalHeader);
    setModalSubmit(modalSubmit);
    setShow(true);
  };

  const handleCreateNewExpense = async (event) => {
    event.preventDefault();
    let data = new FormData(event.target.form);
    const name = data.get("name");
    let amount = data.get("amount");
    amount = Number(amount.replace(/(\.|\$)+/g, ""));

    const spender = data.get("spender");
    let debtors = data.getAll("debtors");
    const spenderIsDebtor = debtors.indexOf(spender) !== -1;
    console.log(spenderIsDebtor);
    let debtAmounts;
    if (spenderIsDebtor) {
      console.log("IS_DERBTOR");
      debtAmounts = new Array(debtors.length).fill(amount / debtors.length);
    } else {
      debtAmounts = new Array(debtors.length + 1).fill(amount / debtors.length);
      debtors.unshift(spender);
      debtAmounts[0] = 0;
    }
    console.log(name, amount, spender, debtors, debtAmounts, debtAmounts.length);

    const tx_options = {
      from: user.currentAccount,
    };
    try {
      const tx = await window.contracts[id].methods.addExpense(name, amount, spender, debtors, debtAmounts, "").send(tx_options);
      console.log(tx);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

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
        if (expenseGroup) {
          console.log("AFTER_INIT", expenseGroup);
          dispatch(fetchExpensesForGroup(expenseGroup.address));
        }
      });
    } else {
      const expenseGroup = store.getState().expenseGroup.data.find((group) => group.address === id);
      if (expenseGroup) {
        console.log("AFTER_INIT", expenseGroup);
        dispatch(fetchExpensesForGroup(expenseGroup.address));
      }
    }
  }, []);

  return (
    <div className="container">
      {expenseGroup ? (
        <>
          <h2>{expenseGroup.name}</h2>
          <p>Owner of this list: {expenseGroup.owner}</p>
          <ExpenseList expenses={expenseGroup.expenses} loading={loading} user={user} />
          <Notes notes={expenseGroup.notes} />
          <Button onClick={() => handleShow("Create new Expense", "Create")}>Create new Expense</Button>
          <AddExpenseModal expenseGroup={expenseGroup} show={show} headerText={modalHeader} submitText={modalSubmit} onClose={handleClose} onSubmit={handleCreateNewExpense} />
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default PageExpenseList;
