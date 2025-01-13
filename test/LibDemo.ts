// import { time, loadFixture, anyValue, ethers, expect } from "./setup";
// import { parseEther, formatEther, TransactionRequest } from "ethers";
// import { LibDemo } from "../typechain-types";
// import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

// describe("LibDemo", function () {
//   let owner: HardhatEthersSigner;
//   let libDemo: LibDemo;

//   beforeEach(async function () {
//     [owner] = await ethers.getSigners();

//     // const ArrExt = await ethers.getContractFactory("ArrExt");
//     // const arrExt = await ArrExt.deploy();
//     // await arrExt.waitForDeployment();
//     // // console.log("ArrExt deployed to:", arrExt.target);

//     // const StrExt = await ethers.getContractFactory("StrExt");
//     // const strExt = await StrExt.deploy();
//     // await strExt.waitForDeployment();
//     // // console.log("StrExt deployed to:", strExt.target);

//     // const LibDemo = await ethers.getContractFactory("LibDemo", {
//     //   libraries: {
//     //     ArrExt: arrExt.target,
//     //     StrExt: strExt.target,
//     //   },
//     // });

//     const LibDemo = await ethers.getContractFactory("LibDemo", owner);
//     libDemo = await LibDemo.deploy();
//     await libDemo.waitForDeployment();
//   });

//   it("it should correctly work with string", async function () {
//     const firstEqStr = "dream";
//     const secondEqStr = "dream";

//     const isEq1 = await libDemo.runnerString(firstEqStr, secondEqStr);

//     expect(isEq1).to.equal(true);

//     const firstNotEqStr = "sun";
//     const secondNotEqStr = "rain";

//     const isEq2 = await libDemo.runnerString(firstNotEqStr, secondNotEqStr);

//     expect(isEq2).to.equal(false);
//   });

//   it("it should correctly work with uint array", async function () {
//     const numbers = [5, 1, 0, 8, 11, 23, 99];

//     const succesCase = await libDemo.runnerArray(numbers, 11);
//     expect(succesCase).to.equal(true);

//     const failCase = await libDemo.runnerArray(numbers, 2);
//     expect(failCase).to.equal(false);
//   });
// });
