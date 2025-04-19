import { loadFixture, ethers, expect, time } from "./setup";
import { Staking } from "../typechain";

describe("Staking Contract", function () {
  async function deployStakingFixture() {
    const [owner, user1] = await ethers.getSigners();

    const StakingFactory = await ethers.getContractFactory("Staking");
    const staking = (await StakingFactory.deploy({ value: ethers.parseEther("10") })) as Staking;

    return { staking, owner, user1 };
  }

  it("should deploy with correct owner and tiers", async () => {
    const { staking, owner } = await loadFixture(deployStakingFixture);

    expect(await staking.owner()).to.equal(owner.address);
    expect(await staking.getInterestRate(0)).to.equal(700);
    expect(await staking.getInterestRate(30)).to.equal(800);
    expect(await staking.getInterestRate(60)).to.equal(900);
    expect(await staking.getInterestRate(90)).to.equal(1200);

    const lockPeriods = await staking.getLockPeriods();
    expect(lockPeriods.map(p => p.toString())).to.deep.equal(["0", "30", "60", "90"]);
  });

  it("should allow user to stake ether and store position", async () => {
    const { staking, user1 } = await loadFixture(deployStakingFixture);
    const amount = ethers.parseEther("1");

    await staking.connect(user1).stakeEther(30, { value: amount });

    const posId = 0;
    const pos = await staking.getPositionById(posId);

    expect(pos.walletAddress).to.equal(user1.address);
    expect(pos.weiStaked).to.equal(amount);
    expect(pos.open).to.be.true;
    expect(pos.percentInterest).to.equal(800);

    const ids = await staking.getPositionIdsForAddress(user1.address);
    expect(ids.length).to.equal(1);
    expect(ids[0]).to.equal(posId);
  });

  it("should not allow staking with unsupported lock period", async () => {
    const { staking, user1 } = await loadFixture(deployStakingFixture);

    await expect(
      staking.connect(user1).stakeEther(45, { value: ethers.parseEther("1") })
    ).to.be.revertedWith("Mapping not found");
  });

  it("should allow user to close position after unlock date and get funds", async () => {
    const { staking, user1 } = await loadFixture(deployStakingFixture);
    const amount = ethers.parseEther("1");
    const duration = 30;

    await staking.connect(user1).stakeEther(duration, { value: amount });
    await time.increase(duration * 24 * 60 * 60 + 1);

    const balBefore = await ethers.provider.getBalance(user1.address);

    const tx = await staking.connect(user1).closePosition(0);
    const receipt = await tx.wait();

    const balAfter = await ethers.provider.getBalance(user1.address);
    expect(balAfter).to.be.gt(balBefore);
  });

  it("should not allow early close of position", async () => {
    const { staking, user1 } = await loadFixture(deployStakingFixture);
    const amount = ethers.parseEther("1");

    await staking.connect(user1).stakeEther(60, { value: amount });

    await expect(
      staking.connect(user1).closePosition(0)
    ).to.be.revertedWith("Position is still locked");
  });

  it("should not allow others to close position", async () => {
    const { staking, user1, owner } = await loadFixture(deployStakingFixture);
    const amount = ethers.parseEther("1");

    await staking.connect(user1).stakeEther(30, { value: amount });
    await time.increase(31 * 24 * 60 * 60);

    await expect(
      staking.connect(owner).closePosition(0)
    ).to.be.revertedWith("Only position creator may modify position");
  });
});
