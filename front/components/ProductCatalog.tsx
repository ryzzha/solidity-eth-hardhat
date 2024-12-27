import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useBlockchain } from "@/shared/context/BlockchainContext";
import { Marketplace } from "@/typechain";

interface Product {
  id: number;
  seller: string;
  title: string;
  price: string;
  quantity: number;
}

export function ProductCatalog() {
  const { contract, signer } = useBlockchain();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    if (!contract) return;

    try {
      const productArray = await contract.getAllProducts();
      const formattedProducts = productArray.map(
        (p: Marketplace.ProductStructOutput) => ({
          id: Number(p.id),
          seller: p.seller,
          title: p.title,
          price: ethers.formatEther(p.price), // Форматування ціни
          quantity: Number(p.quantity),
        })
      );
      setProducts(formattedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!contract) {
      setMessage("Smart contract is not connected.");
      return;
    }

    if (!signer) {
      setMessage("Wallet is not connected.");
      return;
    }

    if (!selectedProduct) {
      setMessage("You dont select any product.");
      return;
    }

    try {
      setBuying(true);
      setMessage("");

      // Розрахунок суми для оплати
      const totalPrice = ethers.parseUnits(
        (Number(selectedProduct.price) * quantity).toString(),
        "ether"
      );

      // Виклик функції покупки
      const tx = await contract
        .connect(signer)
        .buyProduct(selectedProduct.id, quantity, { value: totalPrice });

      await tx.wait();

      setMessage(
        `Successfully purchased ${quantity} x ${selectedProduct.title}`
      );
      setSelectedProduct(null);
      setQuantity(1);
      fetchProducts(); // Оновлення каталогу після покупки
    } catch (error) {
      console.error("Purchase failed:", error);
      setMessage("Purchase failed. Please try again.");
    } finally {
      setBuying(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [contract]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading products...</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center">
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-5 bg-white shadow-lg rounded-xl border border-gray-200 transform transition duration-300 hover:scale-[1.01] hover:shadow-xl"
          >
            <div className="flex justify-center mb-3">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                🛒
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">
              {product.title}
            </h2>
            <p className="text-yellow-400 text-base text-center mb-1">
              <span className="font-bold">Price:</span>{" "}
              <span className="bg-yellow-100  text-gray-700 px-2 py-1 rounded">
                {product.price} ETH
              </span>
            </p>
            <p className="text-green-700 text-base text-center mb-1">
              <span className="font-bold">Quantity:</span>{" "}
              <span className="bg-green-100  px-2 py-1 rounded">
                {product.quantity}
              </span>
            </p>
            <p className="text-gray-500 text-base text-center mt-2">
              <span className="font-bold">Seller:</span>{" "}
              <span className="text-blue-500">
                {product.seller.slice(0, 6)}...{product.seller.slice(-4)}
              </span>
            </p>
            <div className="flex justify-center mt-4">
              <button
                className="px-5 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-300"
                onClick={() => setSelectedProduct(product)}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">
              Buy {selectedProduct.title}
            </h2>
            <p>Price per item: {selectedProduct.price} ETH</p>
            <p>Available quantity: {selectedProduct.quantity}</p>
            <div className="my-4">
              <label
                htmlFor="quantity"
                className="block text-gray-700 font-bold mb-2"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.max(
                      1,
                      Math.min(Number(e.target.value), selectedProduct.quantity)
                    )
                  )
                }
                className="w-full px-3 py-2 border rounded"
                min="1"
                max={selectedProduct.quantity}
              />
            </div>
            <button
              className={`w-full px-3 py-2 font-bold text-white rounded ${
                buying ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={buying}
              onClick={handleBuy}
            >
              {buying ? "Processing..." : "Buy"}
            </button>
            <button
              className="mt-4 w-full px-3 py-2 text-gray-700 font-bold rounded border hover:bg-gray-100"
              onClick={() => setSelectedProduct(null)}
            >
              Cancel
            </button>
            {message && (
              <p className="mt-4 text-center text-green-600 font-bold">
                {message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
