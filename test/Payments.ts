import { time, loadFixture, anyValue, ethers, expect } from "./setup";
import { parseEther, formatEther, keccak256, getBytes } from "ethers";

describe("Payments", function () {
  async function deploy() {
    const [owner, receiver, user] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("Payments");
    const payments = await Factory.deploy({ value: parseEther("100") });
    await payments.waitForDeployment();

    return { owner, receiver, user, payments };
  }

  it("should be deployed", async function () {
    const { owner, receiver, user, payments } = await loadFixture(deploy);

    const amount = parseEther("35");
    const nonce = 1;

    const hashForReceiver = ethers.solidityPackedKeccak256(["address", "uint", "uint", "address"], [receiver.address, amount, nonce, payments.target]);
    const hashForUser = ethers.solidityPackedKeccak256(["address", "uint", "uint", "address"], [user.address, parseEther("12"), 2, payments.target]);

    const signatureForReceiver = await owner.signMessage(getBytes(hashForReceiver));
    const signatureForUser = await owner.signMessage(getBytes(hashForUser));

    const tx1 = await payments.connect(receiver).claim(amount, nonce, signatureForReceiver);
    await tx1.wait();

    await expect(payments.connect(receiver).claim(amount, nonce, signatureForReceiver)).to.revertedWith('already claim');

    await expect(payments.connect(user).claim(amount, 2, signatureForReceiver)).to.revertedWith("wrong sign:(");

    const tx2 = await payments.connect(user).claim(parseEther("12"), 2, signatureForUser);
    await tx2.wait();

  });
 
});
