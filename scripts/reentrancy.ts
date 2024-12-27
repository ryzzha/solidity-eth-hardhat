import { ethers } from "hardhat";
import { Contract, formatEther, parseEther } from "ethers";
import {
  VulnerableBankContract__factory,
  VulnerableBankContract,
  ReentrancyAttack__factory,
  ReentrancyAttack,
} from "../typechain";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const [userOne, userTwo, hacker] = await ethers.getSigners();

  const VulnerableBankFactory = new VulnerableBankContract__factory(userOne);

  const vulnerableBankContract: VulnerableBankContract =
    await VulnerableBankFactory.deploy();

  await vulnerableBankContract.waitForDeployment();

  const ReentrancyAttackContract = new ReentrancyAttack__factory(hacker);

  const reentrancyAttackContract = await ReentrancyAttackContract.deploy(
    vulnerableBankContract.target
  );

  await reentrancyAttackContract.waitForDeployment();

  console.log("START BALANCES");

  console.log(
    "userOne balance: " +
      formatEther((await provider.getBalance(userOne.address)).toString())
  );
  console.log(
    "userTwo balance: " +
      formatEther((await provider.getBalance(userTwo.address)).toString())
  );
  console.log(
    "hacker balance: " +
      formatEther((await provider.getBalance(hacker.address)).toString())
  );
  console.log(
    "vulnerableBankContract balance: " +
      formatEther((await vulnerableBankContract.currentBalance()).toString())
  );
  console.log(
    "reentrancyAttackContract balance: " +
      formatEther((await reentrancyAttackContract.currentBalance()).toString())
  );

  const tx1Data = {
    value: parseEther("2500"),
  };
  const tx1 = await vulnerableBankContract.connect(userOne).deposit(tx1Data);
  await tx1.wait();

  const tx2Data = {
    value: parseEther("3500"),
  };
  const tx2 = await vulnerableBankContract.connect(userTwo).deposit(tx2Data);
  await tx2.wait();

  const tx3 = await reentrancyAttackContract.proxyDepositToBank({
    value: parseEther("1000"),
  });
  await tx3.wait();

  console.log("");
  console.log("BALANCES BEFORE REENTRANCY ATTACK");

  console.log(
    "vulnerableBankContract balance: " +
      formatEther((await vulnerableBankContract.currentBalance()).toString())
  );
  console.log(
    "reentrancyAttackContract balance: " +
      formatEther((await reentrancyAttackContract.currentBalance()).toString())
  );

  const tx4 = await reentrancyAttackContract.attackBank();
  await tx4.wait();

  console.log("");
  console.log("BALANCES AFTER REENTRANCY ATTACK");

  console.log(
    "userOne balance: " +
      formatEther((await provider.getBalance(userOne.address)).toString())
  );
  console.log(
    "userTwo balance: " +
      formatEther((await provider.getBalance(userTwo.address)).toString())
  );
  console.log(
    "hacker balance: " +
      formatEther((await provider.getBalance(hacker.address)).toString())
  );
  console.log(
    "vulnerableBankContract balance: " +
      formatEther((await vulnerableBankContract.currentBalance()).toString())
  );
  console.log(
    "reentrancyAttackContract balance: " +
      formatEther((await reentrancyAttackContract.currentBalance()).toString())
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
