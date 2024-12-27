import { BrowserProvider, Signer } from "ethers";

/**
 * Універсальна функція для отримання контракту.
 *
 * @param contractFactory - Фабрика контракту (наприклад, MusicShop__factory).
 * @param contractAddress - Адреса контракту.
 * @returns Підключений контракт.
 */
export async function getContract<T>(
  contractFactory: {
    connect: (address: string, signerOrProvider: Signer) => T;
  },
  contractAddress: string
): Promise<T> {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return contractFactory.connect(contractAddress, signer);
}
