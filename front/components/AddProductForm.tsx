import React, { useState } from "react";
import { ethers } from "ethers";
import { useBlockchain } from "@/shared/context/BlockchainContext";

export function AddProductForm() {
  const { contract, signer } = useBlockchain();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setMessage("Smart contract is not connected");
      return;
    }

    if (!signer) {
      setMessage("Wallet is not connected");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const priceInWei = ethers.parseUnits(price, "ether");
      const tx = await contract
        .connect(signer)
        .addProduct(title, priceInWei, Number(quantity));

      await tx.wait();

      setMessage("Product added successfully!");
      setTitle("");
      setPrice("");
      setQuantity("");
    } catch (error) {
      console.error(error);
      setMessage("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-3 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl font-bold mb-3">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label className="block text-gray-700 font-bold mb-1" htmlFor="title">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700 font-bold mb-1" htmlFor="price">
            Price (ETH)
          </label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <div className="mb-2">
          <label
            className="block text-gray-700 font-bold mb-1"
            htmlFor="quantity"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full px-3 py-2 text-white font-bold rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
      {message && (
        <p className="mt-3 text-center text-green-600 font-bold">{message}</p>
      )}
    </div>
  );
}
