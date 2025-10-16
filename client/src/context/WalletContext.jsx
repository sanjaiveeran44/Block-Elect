import React, { createContext, useState, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletConnection = async () => {
    if (!window.ethereum) return alert("MetaMask not detected!");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) setCurrentAccount(accounts[0]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.error("MetaMask connection error:", err);
    }
  };

  useEffect(() => {
    checkWalletConnection();
  }, []);

  return (
    <WalletContext.Provider value={{ currentAccount, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
