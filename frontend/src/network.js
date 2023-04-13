export const initializeWallet = async () => {
  const installed = isMetaMaskInstalled();
  const connected = await isMetaMaskConnected();
  return [installed, connected];
};

export const isMetaMaskConnected = async () => {
  if (window.network) {
    const provider = window.network.currentProvider;
    const accounts = await provider.request({ method: "eth_requestAccounts" });
    return accounts && accounts.length > 0;
  }
  return false;
};

export const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};
