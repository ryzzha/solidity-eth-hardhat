// import { time, loadFixture, anyValue, ethers, expect } from "./setup";
// import {
//   parseEther,
//   formatEther,
//   ContractTransactionReceipt,
//   ContractRunner,
// } from "ethers";
// import { AuctionEngine } from "../typechain";

// describe("AuctionEngine", function () {
//   let owner: any;
//   let seller: any;
//   let buyer: any;
//   let auction: AuctionEngine;

//   beforeEach(async function () {
//     [owner, seller, buyer] = await ethers.getSigners();

//     const AuctionEngine = await ethers.getContractFactory(
//       "AuctionEngine",
//       owner
//     );
//     auction = await AuctionEngine.connect(owner).deploy();
//     await auction.waitForDeployment();
//   });

//   it("set owner", async function () {
//     const currentOwner = await auction.owner();
//     // console.log("currentOwner address: " + currentOwner);
//     // console.log("seller address: " + seller.address);
//     expect(currentOwner).to.eq(owner.address);
//   });

//   async function getBlockTimestamp(bn: number): Promise<number> {
//     return (await ethers.provider.getBlock(bn))!.timestamp;
//   }

//   async function delay(ms: number): Promise<number> {
//     return await new Promise((resolve) => setTimeout(resolve, ms));
//   }

//   async function createAuction(
//     signer: ContractRunner,
//     item: string,
//     price: number | bigint,
//     duration: number | bigint,
//     discount: number | bigint
//   ): Promise<ContractTransactionReceipt | null> {
//     const tx = await auction
//       .connect(signer)
//       .createAuction(item, price, duration, discount);
//     return await tx.wait();
//   }

//   describe("create auction", function () {
//     it("create auction correctly", async function () {
//       const item = "fish";
//       const price = parseEther("300");
//       const duration = 60;
//       const discount = parseEther("3");
//       const tx = await createAuction(seller, item, price, duration, discount);

//       const createdAuction = await auction.auctions(0);

//       // console.log(tx);
//       // console.log(createdAuction);

//       expect(createdAuction.item).to.eq(item);

//       const ts = await getBlockTimestamp(tx!.blockNumber!);

//       expect(createdAuction.endAt).to.eq(ts + duration);
//     });
//   });

//   describe("buy", function () {
//     it("allows to buy", async function () {
//       const item = "pizza";
//       const price = parseEther("120");
//       const duration = 50;
//       const discount = parseEther("2");
//       const txCreate = await createAuction(
//         seller,
//         item,
//         price,
//         duration,
//         discount
//       );

//       this.timeout(10000);
//       await delay(5000);

//       const txBuy = await auction
//         .connect(buyer)
//         .buy(0, { value: parseEther("125") });
//       await txBuy.wait();

//       const createdAuction = await auction.auctions(0);

//       const finalPrice = createdAuction.finalPrice;
//       const fee = (finalPrice * BigInt(10)) / BigInt(100);
//       const expectedBalanceChange = finalPrice - fee;

//       console.log(
//         formatEther(await ethers.provider.getBalance(seller.address))
//       );
//       console.log(formatEther(await ethers.provider.getBalance(buyer.address)));

//       expect(() => txBuy).to.changeEtherBalance(seller, expectedBalanceChange);

//       await expect(txBuy)
//         .to.emit(auction, "AuctionEnded")
//         .withArgs(0, finalPrice, buyer.address);

//       await expect(
//         auction.connect(buyer).buy(0, { value: parseEther("125") })
//       ).to.be.revertedWith("auction is stopped!");
//     });
//   });
// });
