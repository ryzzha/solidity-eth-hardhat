// import { SlotsAndData } from "../typechain";
import { loadFixture, ethers, expect, time } from "./setup";
import { BigNumber } from "ethers";

describe("SlotsAndData", function() {

  async function deploy() {
    const [ owner ] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("SlotsAndData");
    const slotsAndData = await Factory.deploy();
    await slotsAndData.waitForDeployment();
    return { owner, slotsAndData }
  }

  async function getAt(addr: string, slot: number | string | BigNumber) {
    return await ethers.provider.getStorage(addr, slot);
  } 

  it('checks state', async function () {
    const { owner, slotsAndData } = await loadFixture(deploy);

    const pos = BigInt(
        ethers.solidityPackedKeccak256(
          ["uint256"],
          [2]
        )
    );

    const nextPos = pos + 1n;

    const mappingPos = ethers.solidityPackedKeccak256(
        ["uint256", "uint256"],
        [ethers.zeroPadValue(slotsAndData.target.toString(), 32), 3]
      );

      const nonExistentMappingPos = ethers.solidityPackedKeccak256(
        ["uint256", "uint256"],
        [ethers.zeroPadValue(owner.address, 32), 3]
      );

    const slots = [ 0, 1, 2, pos, nextPos, mappingPos, nonExistentMappingPos];

    slots.forEach(async (slot) => {
        console.log(`slot ${slot.toString()} has - ` + await getAt(slotsAndData.target.toString(), slot))
    })

  })
})