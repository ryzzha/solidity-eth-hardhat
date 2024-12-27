import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";
import "./tasks/simple-task";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  namedAccounts: {
    deployer: {
      default: 0, // Перший аккаунт у списку (за замовчуванням)
    },
    user: 1,
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", // Локальна мережа Hardhat
    },
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
};

export default config;
