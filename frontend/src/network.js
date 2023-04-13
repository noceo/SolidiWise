import detectEthereumProvider from "@metamask/detect-provider";
import { store } from "./store/store";
import { setCurrentAccount } from "./store/user/userSlice";
import { setMetamaskInstalled, setMetamaskConnected } from "./store/util/utilSlice";
import Web3 from "web3";

export const initializeWallet = async () => {
  if (!store.getState().util.metamaskConnected) {
    const provider = await detectEthereumProvider();
    if (provider !== window.ethereum) {
      store.dispatch(setMetamaskInstalled(false));
      store.dispatch(setMetamaskConnected(false));
      return;
    }

    provider.on("accountsChanged", handleAccountsChanged);
    window.metamask = new Web3(window.ethereum);
    store.dispatch(setMetamaskInstalled(true));
  }

  await connect();
};

const handleAccountsChanged = (accounts) => {
  if (accounts.length === 0) {
    console.log("Please connect to Metamask.");
  } else if (accounts[0] !== store.getState().user.currentAccount) {
    store.dispatch(setCurrentAccount(accounts[0]));
  }
};

const connect = async () => {
  const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
  handleAccountsChanged(accounts);
  store.dispatch(setMetamaskConnected(true));
};
