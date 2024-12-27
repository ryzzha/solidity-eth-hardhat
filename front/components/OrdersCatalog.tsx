import { ethers } from "ethers";
import { useBlockchain } from "@/shared/context/BlockchainContext";
import { useEffect, useState } from "react";
import { Marketplace } from "@/typechain";

interface Order {
  id: number;
  productId: number;
  buyer: string;
  amountPaid: string;
  isDelivered: boolean;
  isWithdrawn: boolean;
}

export const OrdersCatalog = () => {
  const { contract, signer } = useBlockchain();
  const [orders, setOrders] = useState<Order[] | undefined>();

  const fetchOrders = async () => {
    if (!contract || !signer) return;
    const orderArray = await contract.getOrdersByBuyer(signer.getAddress());
    const formattedOrders = orderArray.map(
      (order: Marketplace.OrderStructOutput) => ({
        id: Number(order.id),
        productId: Number(order.productId),
        buyer: order.buyer,
        amountPaid: ethers.formatEther(order.amountPaid),
        isDelivered: order.isDelivered, // Форматування ціни
        isWithdrawn: order.isWithdrawn,
      })
    );
    setOrders(formattedOrders);
  };

  useEffect(() => {
    if (signer && contract) {
      fetchOrders();
    }
  }, [signer, contract]);

  const handleMarkAsDelivered = async (productId: number) => {
    if (!signer || !contract) return;
    const tx = await contract.connect(signer).markOrderAsDelivered(productId);
    await tx.wait();
  };

  return (
    <div className="w-full flex gap-5">
      {!orders && (
        <div className="text-center">
          <p>You have not orders.</p>
        </div>
      )}
      {orders &&
        orders.map((order) => (
          <div
            key={order.id}
            className="p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Заголовок замовлення */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Order #{order.id}
            </h3>

            {/* Інформація про замовлення */}
            <div className="mb-4">
              <p className="text-gray-600">
                <span className="font-semibold">Product ID:</span>{" "}
                {order.productId}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Buyer:</span>{" "}
                {order.buyer.slice(0, 6)}...
                {order.buyer.slice(-4)}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Amount Paid:</span>{" "}
                {order.amountPaid} ETH
              </p>
              <p
                className={`text-sm font-medium mt-2 ${
                  order.isDelivered ? "text-green-600" : "text-red-600"
                }`}
              >
                {order.isDelivered ? "Delivered" : "Not Delivered"}
              </p>
            </div>

            {/* Кнопка позначення як доставлене */}
            {!order.isDelivered && (
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 focus:ring focus:ring-blue-300"
                onClick={() => handleMarkAsDelivered(order.id)}
              >
                Mark as Delivered
              </button>
            )}
          </div>
        ))}
    </div>
  );
};
