import { useEffect, useState } from "react";
import { network } from "./network";
// import Web3 from "web3";
import "./assets/styles/App.css";
import ExpenseList from "./components/ExpenseList";
import Button from "react-bootstrap/Button";
import Spinner from "./components/Spinner";
import FormCreateExpenseList from "./components/FormCreateExpenseList";
import CustomModal from "./components/CustomModal";
import ExpenseGroupList from "./components/ExpenseGroupList";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI } from "./config.js";
import { BrowserRouter as Router, Routes, Route, redirect } from "react-router-dom";
import PageExpenseList from "./pages/PageExpenseList";
import PageNotFound from "./pages/PageNotFound";
import { useDispatch, useSelector } from "react-redux";
import { utilActions } from "./store/util/utilSlice";
import { fetchUser } from "./store/user/userSlice";

const App = (props) => {
  const user = useSelector((state) => state.user);
  const web3 = useSelector((state) => state.util.web3);
  const accounts = useSelector((state) => state.util.accounts);
  const expenseGroups = useSelector((state) => state.expenseGroup);
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState(null);
  const [modalSubmit, setModalSubmit] = useState("");
  const handleClose = () => {
    setShow(false);
    console.log(participants);
  };
  const handleShow = (modalHeader, modalBody, modalSubmit) => {
    setModalHeader(modalHeader);
    setModalBody(modalBody);
    setModalSubmit(modalSubmit);
    setShow(true);
  };

  const [participants, setParticipants] = useState(null);
  const a = web3;
  useEffect(() => {
    const loadBlockchainData = async () => {
      dispatch(fetchUser());
      const expenseListFactory = new network.eth.Contract(EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_FACTORY_ADDRESS);
      const accounts = await network.eth.getAccounts();
      const expenseList = await expenseListFactory.methods.createExpenseList(accounts[0], "TestGroup", [accounts[1]]).estimateGas();
    };
    loadBlockchainData();
  }, []);

  const modalBodyCreateList = <FormCreateExpenseList sendParticipantInformation={setParticipants} />;

  const modalSubmitCreateList = (
    <Button variant="primary" type="submit">
      Create
    </Button>
  );

  let addressElement;
  if (user.loading) addressElement = <Spinner />;
  else addressElement = user.address;

  console.log("EXPENSE_GROUPS", expenseGroups);

  return (
    <div className="app container">
      <h1>SolidiWise</h1>
      <p className="mb-5">Your account: {addressElement}</p>
      <ExpenseGroupList listItems={expenseGroups} />

      <Button variant="primary" onClick={() => handleShow("Create new List", modalBodyCreateList, "Create")}>
        Create new List
      </Button>
      <CustomModal show={show} onClose={handleClose} title={modalHeader} submitText={modalSubmit}>
        {modalBody}
      </CustomModal>
    </div>
  );
};

export default App;
