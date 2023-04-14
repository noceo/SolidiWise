import { useEffect, useState } from "react";
import { connect, initializeWallet } from "./network";
import "./assets/styles/App.css";
import Button from "react-bootstrap/Button";
import Spinner from "./components/Spinner";
import FormCreateExpenseList from "./components/FormCreateExpenseList";
import CustomModal from "./components/CustomModal";
import ExpenseGroupList from "./components/ExpenseGroupList";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenseGroups, addExpenseGroup } from "./store/expenseGroup/expenseGroupSlice";
import { store } from "./store/store";

const App = (props) => {
  const user = useSelector((state) => state.user);
  const expenseGroups = useSelector((state) => state.expenseGroup.data);
  const connected = useSelector((state) => state.util.metamaskConnected);
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

  const handleCreateNewList = async (event) => {
    console.log(event);
    event.preventDefault();
    let data = new FormData(event.target.form);
    const listName = data.get("name");
    const participants = data.getAll("participant-address");

    console.log(listName, participants);
    const tx_options = {
      from: user.currentAccount,
    };
    try {
      const tx = await window.metamask.expenseListFactory.methods.createExpenseList(listName, participants).send(tx_options);
      console.log(tx);
      handleClose();
    } catch (e) {
      console.error(e);
    }
  };

  window.ethereum.on("accountsChanged", async () => {
    await initializeWallet();
  });

  const initWallet = async () => {
    try {
      await initializeWallet();
      window.metamask.expenseListFactory.events
        .ExpenseListCreated()
        .on("connected", (message) => console.log("EXPENSELIST_CREATE_LISTENER_CONNECTED: ", message))
        .on("data", (event) => {
          const payload = event.returnValues;
          console.log("EXPENSELIST_CREATE_EVENT: ", event);
          const currentAccount = store.getState().user.currentAccount;
          console.log("CONDITION", payload.owner, currentAccount, payload.participants);
          if (payload.owner === currentAccount || payload.participants.includes(currentAccount)) {
            console.log("ADD EXPENSE GROUP");
            dispatch(addExpenseGroup(payload.expenseList));
          }
        })
        .on("error", (error) => console.error("ERROR", error));
    } catch (e) {
      console.error(e);
    }
  };

  const loadBlockchainData = async () => {
    // if (window.ethereum) {
    //   const accounts = await window.metamask.eth.getAccounts();
    //   const expenseList = await expenseListFactory.methods.createExpenseList(accounts[0], "TestGroup", ["0xbe7770F9Caae053fA0126f9c58ee936520D26A20"]).estimateGas();
    //   console.log(expenseList);
    // }
  };

  const loadExpenseGroups = async () => {
    dispatch(fetchExpenseGroups());
  };

  useEffect(() => {
    if (!connected && localStorage.getItem("metamask_is_connected")) {
      console.log("Connection established");
      initWallet();
    }

    if (connected) {
      console.log("CONN", connected);
      loadBlockchainData();
      loadExpenseGroups();
    }
  }, [connected]);

  let addressElement;
  if (!connected)
    addressElement = (
      <Button className="mb-5" variant="primary" onClick={initWallet}>
        Connect
      </Button>
    );
  else if (user.loading)
    addressElement = (
      <p className="mb-5">
        <Spinner />
      </p>
    );
  else addressElement = <p className="mb-5">Your account: {user.currentAccount}</p>;

  console.log("EXPENSE_GROUPS", expenseGroups);

  return (
    <div className="app container h-100">
      <h1>SolidiWise</h1>
      {addressElement}
      <ExpenseGroupList listItems={expenseGroups} />

      <Button variant="primary" onClick={() => handleShow("Create new List", "Create")}>
        Create new List
      </Button>
      <CustomModal show={show} onClose={handleClose} title={modalHeader} submitText={modalSubmit} handleSubmit={handleCreateNewList} />
    </div>
  );
};

export default App;
