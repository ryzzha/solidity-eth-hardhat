import { time, loadFixture, anyValue, ethers, expect } from "./setup";
import { parseEther, formatEther } from "ethers";

describe("Payments", function () {
  async function deploy() {
    const [user1, user2] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Payments");
    // console.log(Factory);
    const payments = await Factory.deploy();
    // console.log(payments);
    await payments.waitForDeployment();

    return { user1, user2, payments };
  }

  it("should be deployed", async function () {
    const { user1, user2, payments } = await loadFixture(deploy);

    expect(payments.target).to.be.properAddress;
    // console.log(await payments.getAddress());
    // console.log(user1.address);
  });

  it("should have 0 ethers on balance", async function () {
    const { payments } = await loadFixture(deploy);

    // const balance = await ethers.provider.getBalance(payments.target);
    const balance = await payments.currentBalance();
    expect(balance).to.eq(0);
  });

  it("should be possible to send funds", async function () {
    const { user1, user2, payments } = await loadFixture(deploy);

    const sum = parseEther("10");
    const msg = "for wealthy life";

    // console.log(await ethers.provider.getBalance(user1.address));
    const tx = await payments.connect(user2).pay(msg, { value: sum });
    // console.log(await ethers.provider.getBalance(user1.address));

    await tx.wait();

    // console.log(tx);

    const currentBlock = await ethers.provider.getBlock(
      await ethers.provider.getBlockNumber()
    );

    // console.log(currentBlock);

    const contractBal = await ethers.provider.getBalance(payments.target);
    console.log("contractBal in wei: " + contractBal);
    console.log("contractBal in ether: " + formatEther(contractBal.toString()));

    await expect(tx).to.changeEtherBalance(user2, -sum);

    const newPayment = await payments.getPayment(user2.address, 0);

    expect(newPayment.amount).to.eq(sum);
    expect(newPayment.timestamp).to.eq(currentBlock?.timestamp);
    expect(newPayment.from).to.eq(user2.address);
    expect(newPayment.message).to.eq(msg);
  });
});
