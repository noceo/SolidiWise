import { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import ExpenseList from "./ExpenseList";
import Button from "react-bootstrap/Button";
import FormCreateExpenseList from "./FormCreateExpenseList";
import CustomModal from "./CustomModal";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI } from "./config.js";

const App = (props) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [expenses, setExpenses] = useState([
    {
      title: "Test Title",
    },
  ]);
  const [show, setShow] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalBody, setModalBody] = useState(null);
  const [modalSubmit, setModalSubmit] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = (modalHeader, modalBody, modalSubmit) => {
    setModalHeader(modalHeader);
    setModalBody(modalBody);
    setModalSubmit(modalSubmit);
    setShow(true);
  };

  useEffect(() => {
    const loadBlockchainData = async () => {
      console.log(Web3.givenProvider);
      const web3 = new Web3("http://localhost:8545");
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      const expenseListFactory = new web3.eth.Contract(EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_FACTORY_ADDRESS);
      const expenseList = await expenseListFactory.methods.createExpenseList(accounts[0], "TestGroup", [accounts[1]]).estimateGas();
      console.log("EXPENSELIST", expenseList);
      setWeb3(web3);
      setAccount(accounts[0]);
    };
    loadBlockchainData();
  }, []);

  const modalBodyCreateList = <FormCreateExpenseList />;

  const modalSubmitCreateList = (
    <Button variant="primary" type="submit">
      Create
    </Button>
  );

  return (
    <div className="container">
      <h1>Hello, World!</h1>
      <p>Your account: {account}</p>
      <ExpenseList expenses={expenses} loading={true} />

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
