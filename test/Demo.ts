// import { time, loadFixture, anyValue, ethers, expect } from "./setup";
// import { parseEther, formatEther } from "ethers";

// describe("Demo", function () {
//   let owner: any;
//   let other_address: any;
//   let demo: any;

//   beforeEach(async function () {
//     [owner, other_address] = await ethers.getSigners();

//     const Demo = await ethers.getContractFactory("Demo", owner);
//     demo = await Demo.deploy();
//     await demo.waitForDeployment();
//   });

//   async function sendMoney(sender: any) {
//     const amount = parseEther("100");
//     const txData = {
//       to: demo.target,
//       value: amount,
//     };

//     const tx = await sender.sendTransaction(txData);
//     await tx.wait();

//     return [tx, amount];
//   }

//   it("it should allow to send money", async function () {
//     const [sendMoneyTx, amount] = await sendMoney(other_address);
//     await expect(() => sendMoneyTx).to.changeEtherBalance(demo.target, amount);

//     const block = await ethers.provider.getBlock(sendMoneyTx.blockNumber);
//     const timestamp = block!.timestamp;

//     await expect(sendMoneyTx)
//       .to.emit(demo, "Paid")
//       .withArgs(other_address.address, amount, timestamp);
//   });

//   it("it should allow owner to withdraw money", async function () {
//     const [_, amount] = await sendMoney(other_address);

//     const tx = await demo.connect(owner).withdraw(owner.address);

//     await expect(() => tx).to.changeEtherBalances(
//       [demo.target, owner.address],
//       [-amount, amount]
//     );
//   });

//   it("it should dont allow other to withdraw money", async function () {
//     await sendMoney(other_address);

//     await expect(
//       demo.connect(other_address).withdraw(owner.address)
//     ).to.be.revertedWith("you are not a owner");
//   });
// });
