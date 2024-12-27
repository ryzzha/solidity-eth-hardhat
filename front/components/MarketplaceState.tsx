import React, { useEffect, useState } from "react";
import { ethers, parseEther } from "ethers";
import { useBlockchain } from "@/shared/context/BlockchainContext";

interface MarketplaceInfo {
  productCount: number;
  orderCount: number;
  contractBalance: string;
  feePercent: number;
  owner: string;
}

export function MarketplaceState() {
  const { wsProvider, contract, loadingContract, signer } = useBlockchain();
  const [info, setInfo] = useState<MarketplaceInfo | null>(null);
  const [message, setMessage] = useState("");
  const [amount, setAmount] = useState("");

  const fetchMarketplaceInfo = async () => {
    try {
      if (!contract) return;

      const productCount = Number(await contract.productCount());
      const orderCount = Number(await contract.orderCount());
      const contractBalance = await contract.getContractBalance(); // повертає `bigint`
      const feePercent = Number(await contract.feePercent());
      const owner = await contract.owner();

      setInfo({
        productCount,
        orderCount,
        contractBalance: ethers.formatEther(contractBalance),
        feePercent,
        owner,
      });
    } catch (error) {
      console.error("Error fetching marketplace info:", error);
    } finally {
    }
  };

  const withdrawAllSellerFunds = async () => {
    if (!contract) return;
    if (!signer) {
      setMessage("your must connect waller for withdraw");
      return;
    }
    const tx = await contract.connect(signer).withdrawFunds();
    await tx.wait();
    console.log(tx);
    setMessage("sucsesfully withdraw");
  };

  const withdrawOwnerFunds = async (amount: string) => {
    if (!contract) return;
    if (!signer) {
      setMessage("your must connect waller for withdraw");
      return;
    }
    const tx = await contract
      .connect(signer)
      .withdrawContractBalance(parseEther(amount));
    await tx.wait();
    console.log(tx);
    setMessage("sucsesfully withdraw");
  };

  fetchMarketplaceInfo();

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    try {
      await withdrawOwnerFunds(amount);
      setMessage(`Successfully withdrawn ${amount} ETH.`);
    } catch (error) {
      console.error("Withdraw failed:", error);
      setMessage("Failed to withdraw funds. Please try again.");
    }
  };

  useEffect(() => {
    if (!wsProvider || !contract) {
      console.warn("WebSocket provider or contract is not initialized");
      return;
    }

    console.log("WebSocket provider and contract initialized", {
      wsProvider,
      contract,
    });

    const handleEvent = () => {
      console.log("handle websoket event");
      fetchMarketplaceInfo();
    };

    const filter = contract.filters.Received();

    contract.on(filter, (sender: string, amount: bigint) => {
      console.log(
        `Received ETH from ${sender}, Amount: ${ethers.formatEther(amount)} ETH`
      );
      handleEvent();
    });

    return () => {
      contract.off(filter, handleEvent);
    };
  }, [wsProvider, contract]);

  if (loadingContract) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-medium">
            Loading marketplace data...
          </p>
        </div>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="flex items-center justify-center bg-gray-50">
        <p className="text-red-500 font-bold">
          Failed to load marketplace information.
        </p>
      </div>
    );
  }

  return (
    <div className="w-auto bg-white rounded-3xl shadow-lg mx-20 px-8 py-5">
      <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">
        Statistic Overview
      </h1>
      <div className="grid grid-cols-5 gap-5">
        <div className="px-5 py-3 bg-blue-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-blue-700">
            Total Products
          </h2>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {info.productCount}
          </p>
        </div>
        <div className="px-5 py-3 bg-green-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-green-700">Total Orders</h2>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {info.orderCount}
          </p>
        </div>
        <div className="px-5 py-3 bg-yellow-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-yellow-700">
            Contract Balance
          </h2>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {info.contractBalance} ETH
          </p>
        </div>
        <div className="px-5 py-3 bg-red-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-red-700">Fee Percent</h2>
          <p className="text-2xl font-bold text-red-900 mt-1">
            {info.feePercent}%
          </p>
        </div>
        <div className="px-5 py-3 bg-gray-50 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700">Owner</h2>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {info.owner.slice(0, 6)}...{info.owner.slice(-4)}
          </p>
        </div>
      </div>
      <div className="mt-5 flex justify-center items-center gap-3">
        <div className="flex flex-col">
          <button
            className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
            onClick={withdrawAllSellerFunds}
          >
            Withdraw all funds from your sales
          </button>
          {message && (
            <p className="mt-4 text-center text-green-600 font-bold">
              {message}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Поле вводу */}
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value.toString())}
            placeholder="Enter amount in ETH"
            className="max-w-48 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring focus:ring-blue-300 focus:outline-none"
          />

          {/* Кнопка */}
          <button
            className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
            onClick={handleWithdraw}
          >
            Withdraw funds for owner
          </button>
          <br></br>
          {/* Повідомлення */}
          {message && (
            <p className="mt-4 text-center text-green-600 font-bold">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
