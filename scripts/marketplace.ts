import hre, { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";
import { Contract, parseEther } from "ethers";

async function main() {
  // if (network.name === "hardhat") {
  //   console.warn(
  //     "You are trying to deploy a contract to the Hardhat Network, which" +
  //       "gets automatically created and destroyed every time. Use the Hardhat" +
  //       " option '--network localhost'"
  //   );
  // }

  const [base, owner] = await ethers.getSigners();

  // console.log("deployer address: " + (await deployer.getAddress()));

  // const DutchAuction = await ethers.getContractFactory(
  //   "DutchAuction",
  //   deployer
  // );
  // const auction = await DutchAuction.deploy(
  //   parseEther("950"),
  //   parseEther("0.01"),
  //   "Motorbike"
  // );
  // await auction.waitForDeployment();

  const Marketplace = await ethers.getContractFactory("Marketplace", owner);
  const marketplace = await Marketplace.deploy();

  await marketplace.waitForDeployment();

  console.log("marketplace address: " + (await marketplace.getAddress()));
  console.log("owner address: " + (await owner.getAddress()));
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  console.log(
    "base address balance: " + (await provider.getBalance(base.address))
  );

  // saveFrontendFiles({
  //   DutchAuction: auction,
  // });
}

// type ContractsMap = {
//   [contractName: string]: Contract;
// };

// function saveFrontendFiles(contracts: ContractsMap) {
//   const contractsDir = path.join(__dirname, "/..", "front/contracts");

//   console.log("contractsDir: " + contractsDir);

//   if (!fs.existsSync(contractsDir)) {
//     fs.mkdirSync(contractsDir);
//   }

//   Object.entries(contracts).forEach((contract_item) => {
//     const [name, contract] = contract_item;

//     if (contract) {
//       fs.writeFileSync(
//         path.join(contractsDir, "/", name + "-contract-address.json"),
//         JSON.stringify({ [name]: contract.target }, undefined, 2)
//       );
//     }

//     const ContractArtifact = hre.artifacts.readArtifactSync(name);

//     fs.writeFileSync(
//       path.join(contractsDir, "/", name + ".json"),
//       JSON.stringify(ContractArtifact, null, 2)
//     );
//   });
// }

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
