// import { time, loadFixture, anyValue, ethers, expect } from "./setup";
// import { parseEther, formatEther, TransactionRequest } from "ethers";
// import { Logger, Receiver } from "../typechain-types";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// describe("Receiver", function () {
//   let owner: HardhatEthersSigner;
//   let logger: Logger;
//   let receiver: Receiver;

//   beforeEach(async function () {
//     [owner] = await ethers.getSigners();

//     const Logger = await ethers.getContractFactory("Logger", owner);
//     logger = await Logger.deploy();
//     await logger.waitForDeployment();

//     const Receiver = await ethers.getContractFactory("Receiver", owner);
//     receiver = await Receiver.deploy(logger.target);
//     await receiver.waitForDeployment();
//   });

//   it("it should allow to pay and get payment info", async function () {
//     const amount = parseEther("300");
//     const txData: TransactionRequest = {
//       value: amount,
//       to: receiver.target,
//     };

//     const tx = await owner.sendTransaction(txData);
//     await tx.wait();

//     expect(tx).to.changeEtherBalance(
//       [owner, receiver.target],
//       [-amount, amount]
//     );

//     const firstTxAmount = await logger.getEntry(owner.address, 0);

//     expect(firstTxAmount).to.eq(amount);
//   });
// });
