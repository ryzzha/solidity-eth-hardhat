"use client";
import React, { createContext, useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import { MARKETPLACE_ADDRESS } from "../../config";
import { Marketplace, Marketplace__factory } from "@/typechain";

interface BlockchainContextProps {
  browserProvider: ethers.BrowserProvider | null;
  wsProvider: ethers.WebSocketProvider | null;
  signer: ethers.Signer | null;
  account: string | null;
  contract: Marketplace | null;
  loadingContract: boolean;
  loadingWallet: boolean;
  connectWallet: () => Promise<void>; // Додано стан завантаження
}

const BlockchainContext = createContext<BlockchainContextProps>({
  browserProvider: null,
  wsProvider: null,
  signer: null,
  account: null,
  contract: null,
  loadingContract: true,
  loadingWallet: false,
  connectWallet: async () => {},
});

export const useBlockchain = () => useContext(BlockchainContext);

export const BlockchainProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [browserProvider, setBrowserProvider] =
    useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Marketplace | null>(null);
  const [loadingContract, setLoadingContract] = useState<boolean>(true); // Доданий стан завантаження
  const [loadingWallet, setLoadingWallet] = useState<boolean>(false);

  const wsProvider = useWebSocketProvider();

  useEffect(() => {
    const initContract = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const contract = Marketplace__factory.connect(
          MARKETPLACE_ADDRESS,
          provider
        );
        setContract(contract);
      } catch (error) {
        console.error("Error initializing contract:", error);
      } finally {
        setLoadingContract(false);
      }
    };

    initContract();
  }, []);

  const connectWallet = async () => {
    try {
      setLoadingWallet(true);
      if (window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(
          window.ethereum,
          "any"
        );
        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const account = await signer.getAddress();

        setBrowserProvider(browserProvider);
        setSigner(signer);
        setAccount(account);

        // // Уникаємо дублювання слухачів
        // if (!window.ethereum.on.listeners("accountsChanged").length) {
        //   window.ethereum.on("accountsChanged", (accounts: string[]) => {
        //     setAccount(accounts[0] || null);
        //     setSigner(null);
        //   });
        // }
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setLoadingWallet(false);
    }
  };

  return (
    <BlockchainContext.Provider
      value={{
        browserProvider,
        wsProvider,
        signer,
        account,
        contract,
        loadingContract,
        loadingWallet,
        connectWallet,
      }}
    >
      {children}
    </BlockchainContext.Provider>
  );
};

const useWebSocketProvider = () => {
  const [wsProvider, setWsProvider] = useState<ethers.WebSocketProvider | null>(
    null
  );

  useEffect(() => {
    const ws = new ethers.WebSocketProvider("ws://127.0.0.1:8545");

    // Обробка подій WebSocket
    ws.on("block", (blockNumber) => {
      console.log("New block:", blockNumber);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    setWsProvider(ws);

    return () => {
      ws.destroy();
    };
  }, []);

  return wsProvider;
};
