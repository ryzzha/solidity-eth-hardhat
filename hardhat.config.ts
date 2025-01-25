import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import "@typechain/hardhat";
import "@openzeppelin/hardhat-upgrades";
import "hardhat-deploy";
import "./tasks/simple-task";
import { config as dotenvConfig } from "dotenv"; 
dotenvConfig(); 

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  // defaultNetwork: "zkTestnet", --network zkTestnet
  zksolc: {
    version: "1.3.5",
    compilerSource: "binary",
    settings: {},
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545", 
    },
    zkTestnet: {
      url: "https://sepolia.era.zksync.dev",
      accounts: [process.env.PRIVATE_KEY!],
      zksync: true,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, 
    },
    user: 1,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v6",
  },
};

export default config;
