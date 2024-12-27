"use client";
import { useBlockchain } from "@/shared/context/BlockchainContext";
import React from "react";

export const ConnectWalletButton = () => {
  const { connectWallet, account, loadingWallet } = useBlockchain();

  return (
    <div className="flex items-center justify-center">
      {account ? (
        <div className="flex items-center gap-2 p-3 bg-green-500 opacity-80 rounded-full shadow-md">
          <span className="text-white font-medium ">
            ✅ Connected: {account.slice(0, 6)}...{account.slice(-4)}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className={`relative inline-flex items-center px-6 py-3 font-medium text-white transition-all duration-300 ease-in-out rounded-full shadow-md ${
            loadingWallet
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring focus:ring-blue-300"
          }`}
          disabled={loadingWallet}
        >
          {loadingWallet ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Connecting...
            </span>
          ) : (
            "Connect Wallet"
          )}
        </button>
      )}
    </div>
  );
};
