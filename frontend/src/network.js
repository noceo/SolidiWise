import detectEthereumProvider from "@metamask/detect-provider";
import { store } from "./store/store";
import { setCurrentAccount } from "./store/user/userSlice";
import { setMetamaskInstalled, setMetamaskConnected } from "./store/util/utilSlice";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_ABI } from "./config.js";
import Web3 from "web3";
import { fetchExpenseGroups, addExpenseGroup } from "./store/expenseGroup/expenseGroupSlice";

export const initializeWallet = async () => {
  const provider = await detectEthereumProvider();
  provider.on("accountsChanged", handleAccountsChanged);
  window.metamask = new Web3(window.ethereum);
  window.contracts = {};
  window.metamask.expenseListFactory = new window.metamask.eth.Contract(EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_FACTORY_ADDRESS);
  window.metamask.expenseListFactory.events
    .ExpenseListCreated()
    .on("connected", (message) => console.log("EXPENSELIST_CREATE_LISTENER_CONNECTED: ", message))
    .on("data", async (event) => {
      const payload = event.returnValues;
      console.log("EXPENSELIST_CREATE_EVENT: ", event);
      const currentAccount = store.getState().user.currentAccount;

      const address = payload.expenseList;
      const owner = payload.owner.toLowerCase();
      const participants = payload.participants.map((address) => address.toLowerCase());
      if (owner === currentAccount || participants.includes(currentAccount)) {
        console.log("ADD EXPENSE GROUP");
        const contract = new window.metamask.eth.Contract(EXPENSE_LIST_ABI, address);
        window.contracts[address] = contract;
        const name = await contract.methods.getName().call();
        let owner = await contract.methods.getOwner().call();
        owner = owner.toLowerCase();
        let participants = await contract.methods.getParticipants().call();
        participants = participants.map((address) => address.toLowerCase());

        const newExpenseGroup = {
          name,
          address,
          owner,
          participants,
          notes: "",
          expenses: [],
        };
        store.dispatch(addExpenseGroup(newExpenseGroup));
      }
    })
    .on("error", (error) => console.error("ERROR", error));

  if (!store.getState().util.metamaskConnected) {
    if (provider !== window.ethereum) {
      store.dispatch(setMetamaskInstalled(false));
      store.dispatch(setMetamaskConnected(false));
      return;
    }
    console.log("METAMASK_CONNECTED");
    store.dispatch(setMetamaskInstalled(true));
  }

  try {
    await connect();
  } catch (error) {
    throw error;
  }
};

const handleAccountsChanged = async (accounts) => {
  console.log("ACCOUNT_CHANGE");
  if (accounts.length === 0) {
    console.log("Please connect to Metamask.");
  } else if (accounts[0] !== store.getState().user.currentAccount) {
    store.dispatch(setCurrentAccount(accounts[0]));
    await store.dispatch(fetchExpenseGroups());
  }
};

export const connect = async () => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  await handleAccountsChanged(accounts);
  store.dispatch(setMetamaskInstalled(true));
  store.dispatch(setMetamaskConnected(true));

  if (localStorage.getItem("metamask_is_connected") === null || localStorage.getItem("metamask_is_connected") === false) {
    localStorage.setItem("metamask_is_connected", true);
  }
};
