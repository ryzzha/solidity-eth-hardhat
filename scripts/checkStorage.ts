import { ethers } from "hardhat";

async function main() {
  // Підключаємося до локальної мережі Hardhat
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  // Отримуємо значення зі сховища за адресою і слотом
  const storageValue = await provider.getStorage(
    "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    1
  );
  console.log(
    "Storage value at slot 0:",
    ethers.decodeBytes32String(storageValue)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
