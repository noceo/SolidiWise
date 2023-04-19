import { useCallback, useEffect, useState } from "react";
import { connect, initializeWallet } from "../network";
import "../assets/styles/App.css";
import Button from "react-bootstrap/Button";
import Spinner from "../components/Spinner";
import FormCreateExpenseList from "../components/FormCreateExpenseList";
import CustomModal from "../components/CustomModal";
import ExpenseGroupList from "../components/ExpenseGroupList";
import { useDispatch, useSelector } from "react-redux";
import { fetchExpenseGroups, addExpenseGroup } from "../store/expenseGroup/expenseGroupSlice";
import { store } from "../store/store";

const PageHome = () => {
  const user = useSelector((state) => state.user);
  const expenseGroups = useSelector((state) => state.expenseGroup.data);
  const connected = useSelector((state) => state.util.metamaskConnected);
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

  const initWallet = useCallback(async () => {
    try {
      await initializeWallet();
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    if (!connected && localStorage.getItem("metamask_is_connected")) {
      console.log("Connection established");
      initWallet();
    }
  }, [initWallet]);

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

  return (
    <div className="app container">
      <h1>SolidiWise</h1>
      {addressElement}
      <ExpenseGroupList listItems={expenseGroups} />

      <Button variant="primary" onClick={() => handleShow("Create new List", "Create")}>
        Create new List
      </Button>
      <CustomModal show={show} headerText={modalHeader} submitText={modalSubmit} onClose={handleClose} onSubmit={handleCreateNewList} />
    </div>
  );
};

export default PageHome;
