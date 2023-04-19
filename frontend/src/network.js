import detectEthereumProvider from "@metamask/detect-provider";
import { store } from "./store/store";
import { setCurrentAccount } from "./store/user/userSlice";
import { setMetamaskInstalled, setMetamaskConnected } from "./store/util/utilSlice";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI } from "./config.js";
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
    .on("data", (event) => {
      const payload = event.returnValues;
      console.log("EXPENSELIST_CREATE_EVENT: ", event);
      const currentAccount = store.getState().user.currentAccount;
      console.log("CONDITION", payload.owner, currentAccount, payload.participants);
      if (payload.owner === currentAccount || payload.participants.includes(currentAccount)) {
        console.log("ADD EXPENSE GROUP");
        store.dispatch(addExpenseGroup(payload.expenseList));
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
  console.log(accounts);
  await handleAccountsChanged(accounts);
  console.log(store.getState().expenseGroup.data);
  store.dispatch(setMetamaskInstalled(true));
  store.dispatch(setMetamaskConnected(true));
  console.log("DISPATCHED_CONNECTED", store.getState().util.metamaskConnected);

  if (localStorage.getItem("metamask_is_connected") === null || localStorage.getItem("metamask_is_connected") === false) {
    localStorage.setItem("metamask_is_connected", true);
  }
};
