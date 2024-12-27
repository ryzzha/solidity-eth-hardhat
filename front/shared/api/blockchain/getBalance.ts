import { ethers, BrowserProvider } from "ethers";

/**
 * Функція для отримання балансу користувача
 *
 * @param provider - Провайдер (наприклад, MetaMask).
 * @returns Баланс у форматі строкового числа (ETH).
 */
export const getBalance = async (
  provider: BrowserProvider
): Promise<string> => {
  if (!provider) {
    throw new Error("Provider not found");
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const balance = await provider.getBalance(address);
  return ethers.formatEther(balance); // Конвертація в ETH
};
