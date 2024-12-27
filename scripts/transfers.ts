import { ethers } from "hardhat";
import { parseEther, formatEther } from "ethers";
import TransferArtifact from "../artifacts/contracts/Transfers.sol/Transfers.json";
// import { Transfers } from "../typechain-types/contracts/Transfers";

async function currentBalance(address: string, message = "") {
  const rawBalance = await ethers.provider.getBalance(address);
  console.log(message + " " + formatEther(rawBalance));
}

async function main() {
  const [acc1, acc2, acc3, acc4] = await ethers.getSigners();
  const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
  const transfersContract = new ethers.Contract(
    contractAddress,
    TransferArtifact.abi,
    acc1
  );

  // const tx = {
  //   to: contractAddress,
  //   value: parseEther("1000"),
  // };

  // const txSend = await acc4.sendTransaction(tx);
  // await txSend.wait();

  await transfersContract
    // .connect(acc3)
    .withdrawTo("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266");

  // const result = await transfersContract.getTransfer(0);

  // console.log(
  //   `receive ${formatEther(result["amount"])} ethers from address ${
  //     result["sender"]
  //   }`
  // );

  await currentBalance(contractAddress, "Contract balance:");
  await currentBalance(acc1.address, "Account 1 balance:");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
