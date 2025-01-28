import { config as dotenvConfig } from "dotenv";
dotenvConfig();

import { Wallet } from "zksync-ethers";
import { utils } from "zksync-web3"; 
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// npx hardhat deploy-zksync --script deploy --network zkTestnet

export default async function (hre: HardhatRuntimeEnvironment) {
    const PRIVATE_KEY = process.env.PRIVATE_KEY;

    if (!PRIVATE_KEY) {
        throw new Error("Please set ZKS_PRIVATE_KEY in the .env file");
    }

    const wallet = new Wallet(PRIVATE_KEY);

    const deployer = new Deployer(hre, wallet);

    const artifact = await deployer.loadArtifact("Transfers");

    const secret = 42;
    const deploymentFee = await deployer.estimateDeployFee(artifact, [secret]);

    const tx = await deployer.zkWallet.deposit({
        to: deployer.zkWallet.address,
        token: utils.ETH_ADDRESS,
        amount: deploymentFee * 2n,
    });

    console.log(`Contract deployed at: ${artifact.contractName}`);
}
