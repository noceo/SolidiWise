import { useEffect, useState } from "react";
import { initializeWallet } from "./network";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI } from "./config.js";
import "./assets/styles/App.css";
import Button from "react-bootstrap/Button";
import Spinner from "./components/Spinner";
import FormCreateExpenseList from "./components/FormCreateExpenseList";
import CustomModal from "./components/CustomModal";
import ExpenseGroupList from "./components/ExpenseGroupList";
import { useDispatch, useSelector } from "react-redux";

const App = (props) => {
  const user = useSelector((state) => state.user);
  const expenseGroups = useSelector((state) => state.expenseGroup);
  const connected = useSelector((state) => state.util.metamaskConnected);
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

  window.ethereum.on("accountsChanged", async () => {
    await initializeWallet();
  });

  const initWallet = async () => {
    await initializeWallet();
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const expenseListFactory = new window.metamask.eth.Contract(EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_FACTORY_ADDRESS);
        const accounts = await window.metamask.eth.getAccounts();
        const expenseList = await expenseListFactory.methods.createExpenseList(accounts[0], "TestGroup", [accounts[1]]).estimateGas();
      }
    };

    if (!expenseGroups) {
      loadBlockchainData();
    }
  }, []);

  const modalBodyCreateList = <FormCreateExpenseList sendParticipantInformation={setParticipants} />;

  const modalSubmitCreateList = (
    <Button variant="primary" type="submit">
      Create
    </Button>
  );

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
