import { time, loadFixture, anyValue, ethers, expect } from "./setup";
import type { LowkickStarter } from "../typechain";
import { Compaign__factory } from "../typechain";
import { formatEther, parseEther } from "ethers";

describe("LowkickStarter", function() {
    async function dep() {
      const [ owner, pledger1, pledger2 ] = await ethers.getSigners();

      const LowkickStarterFactory = await ethers.getContractFactory("LowkickStarter");
      const lowkick: LowkickStarter = await LowkickStarterFactory.deploy();
      await lowkick.waitForDeployment();

      return { lowkick, owner, pledger1, pledger2 }
    }

    it('allows to pledge and claim', async function() {
      const { lowkick, owner, pledger1, pledger2 } = await loadFixture(dep);
        
      const goal = parseEther("1000");
      const endTime = Math.floor(Date.now() / 1000) + 25;

      const startTx = await lowkick.start(goal, endTime);
      await startTx.wait();

      const firstCompaignAddrs = (await lowkick.compaings(1)).targetContract;

      const compaingAsOwner = Compaign__factory.connect(firstCompaignAddrs, owner);
      const compaingAsPledger1 = Compaign__factory.connect(firstCompaignAddrs, pledger1);
      const compaingAsPledger2 = Compaign__factory.connect(firstCompaignAddrs, pledger2);

      const pledger1Tx = await compaingAsPledger1.pledge({ value: parseEther("350") });
      await pledger1Tx.wait();

      const pledger2Tx = await compaingAsPledger2.pledge({ value: parseEther("800") });
      await pledger2Tx.wait();

      const compaignBalBefore = await ethers.provider.getBalance(compaingAsOwner);

      console.log("compaignBalBefore: " + formatEther(compaignBalBefore))

      expect(compaignBalBefore).to.eq(parseEther("1150"));

      await expect(compaingAsOwner.claim()).to.be.reverted;

      await expect(compaingAsPledger1.fullRefund()).to.be.reverted;
      await expect(compaingAsPledger1.refundPledge(parseEther("100"))).to.changeEtherBalances([compaingAsOwner, pledger1], [-(parseEther("100")), parseEther("100")])

      const compaignBalAfterRefund = await ethers.provider.getBalance(compaingAsOwner);
      console.log("compaignBalAfterRefund: " + formatEther(compaignBalAfterRefund))

      await time.increase(30);

      await expect(compaingAsOwner.claim()).to.changeEtherBalances([compaingAsOwner, owner], [-(parseEther("1050")), parseEther("1050")])

      const compaignBalAfter = await ethers.provider.getBalance(compaingAsOwner);

      console.log("compaignBalAfter: " + formatEther(compaignBalAfter))
    });

    it('allows to refund if time end and goal is not enougth', async function() {
        const { lowkick, owner, pledger1, pledger2 } = await loadFixture(dep);

        const goal = parseEther("1000");
        const endTime = Math.floor(Date.now() / 1000) + 25;
  
        const startTx = await lowkick.start(goal, endTime);
        await startTx.wait();
  
        const firstCompaignAddrs = (await lowkick.compaings(1)).targetContract;
  
        const compaingAsOwner = Compaign__factory.connect(firstCompaignAddrs, owner);
        const compaingAsPledger1 = Compaign__factory.connect(firstCompaignAddrs, pledger1);
        const compaingAsPledger2 = Compaign__factory.connect(firstCompaignAddrs, pledger2);
  
        const pledger1Tx = await compaingAsPledger1.pledge({ value: parseEther("1250") });
        await pledger1Tx.wait();
  
        const pledger2Tx = await compaingAsPledger2.pledge({ value: parseEther("500") });
        await pledger2Tx.wait();
  
        const compaignBalBefore = await ethers.provider.getBalance(compaingAsOwner);
  
        console.log("compaignBalBefore: " + formatEther(compaignBalBefore))
  
        expect(compaignBalBefore).to.eq(parseEther("1750"));
  
        await time.increase(30);

        await expect(compaingAsPledger2.fullRefund()).to.changeEtherBalances([compaingAsOwner, pledger2], [-(parseEther("500")), parseEther("500")])
        await expect(compaingAsPledger2.refundPledge(parseEther("100"))).to.be.reverted;
  
        await expect(() => compaingAsOwner.claim()).to.changeEtherBalances([compaingAsOwner, owner], [-(parseEther("1250")), parseEther("1250")])
  
        const compaignBalAfter = await ethers.provider.getBalance(compaingAsOwner);
  
        console.log("compaignBalAfter: " + formatEther(compaignBalAfter))
    })
  });