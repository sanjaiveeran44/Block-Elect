
import React, { createContext, useEffect, useState, useCallback } from "react";

export const WalletContext = createContext();


const ADMIN_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266".toLowerCase();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected. Please install MetaMask and connect to localhost:8545.");
      return null;
    }
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts && accounts.length > 0) {
        const selected = accounts[0];
        setAccount(selected);
        return selected;
      }
      return null;
    } catch (err) {
      console.error("connectWallet error:", err);
      return null;
    }
  }, []);


  const checkIfConnected = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.error("checkIfConnected error:", err);
    }
  }, []);

  useEffect(() => {
    checkIfConnected();

    if (!window.ethereum) return;
    const handler = (accounts) => {
      if (accounts.length === 0) {
        setAccount(null);
      } else {
        setAccount(accounts[0]);
      }
    };
    window.ethereum.on("accountsChanged", handler);
    return () => {
      if (window.ethereum.removeListener) window.ethereum.removeListener("accountsChanged", handler);
    };
  }, [checkIfConnected]);

  const isAdmin = !!account && account.toLowerCase() === ADMIN_ADDRESS;

  return (
    <WalletContext.Provider value={{ account, connectWallet, isAdmin }}>
      {children}
    </WalletContext.Provider>
  );
};
