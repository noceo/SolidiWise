import detectEthereumProvider from "@metamask/detect-provider";
import { store } from "./store/store";
import { setCurrentAccount } from "./store/user/userSlice";
import { setMetamaskInstalled, setMetamaskConnected } from "./store/util/utilSlice";
import { EXPENSE_LIST_FACTORY_ADDRESS, EXPENSE_LIST_FACTORY_ABI } from "./config.js";
import Web3 from "web3";
import { fetchExpenseGroups } from "./store/expenseGroup/expenseGroupSlice";

export const initializeWallet = async () => {
  const provider = await detectEthereumProvider();
  provider.on("accountsChanged", handleAccountsChanged);
  window.metamask = new Web3(window.ethereum);
  window.metamask.expenseListFactory = new window.metamask.eth.Contract(EXPENSE_LIST_FACTORY_ABI, EXPENSE_LIST_FACTORY_ADDRESS);
  window.contracts = {};

  if (!store.getState().util.metamaskConnected) {
    if (provider !== window.ethereum) {
      store.dispatch(setMetamaskInstalled(false));
      store.dispatch(setMetamaskConnected(false));
      return;
    }
    console.log("METAMASK_CONNECTED");
    store.dispatch(setMetamaskInstalled(true));
  }

  await connect();
};

const handleAccountsChanged = (accounts) => {
  console.log("ACCOUNT_CHANGE");
  if (accounts.length === 0) {
    console.log("Please connect to Metamask.");
  } else if (accounts[0] !== store.getState().user.currentAccount) {
    store.dispatch(setCurrentAccount(accounts[0]));
    store.dispatch(fetchExpenseGroups());
  }
};

export const connect = async () => {
  const accounts = await window.metamask.eth.getAccounts();
  handleAccountsChanged(accounts);
  store.dispatch(setMetamaskInstalled(true));
  store.dispatch(setMetamaskConnected(true));
  console.log("DISPATCHED_CONNECTED", store.getState().util.metamaskConnected);

  if (localStorage.getItem("metamask_is_connected") === null || localStorage.getItem("metamask_is_connected") === false) {
    localStorage.setItem("metamask_is_connected", true);
  }
};
