import { loadFixture, ethers, expect, time } from "./setup";
import type { RoleContract } from "../typechain";

describe("RoleContract", function() {
  async function deploy() {
    const [ superadmin, withdrawer, user ] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("RoleContract");
    const roleContract: RoleContract = await Factory.deploy(withdrawer.address);
    await roleContract.waitForDeployment();
    return { roleContract, superadmin, withdrawer, user }
  }
  it('works', async function() {
    const { roleContract, superadmin, withdrawer, user } = await loadFixture(deploy);
    const defaultAdmin = await roleContract.DEFAULT_ADMIN_ROLE();
    const withdrawerRole = await roleContract.WITHDRAWER_ROLE();
    const minterRole = await roleContract.MINTER_ROLE();

    console.log("default role - " + defaultAdmin)
    console.log("default role admin - " + await roleContract.getRoleAdmin(defaultAdmin))

    console.log("withdrawer role - " + withdrawerRole)
    console.log("withdrawer role admin - " + await roleContract.getRoleAdmin(withdrawerRole))

    console.log("minter role - " + minterRole)
    console.log("minter role admin - " + await roleContract.getRoleAdmin(minterRole))

    expect(await roleContract.getRoleAdmin(withdrawerRole)).to.eq(defaultAdmin);

    await roleContract.connect(withdrawer).withdraw();

    await expect(roleContract.withdraw()).to.be.revertedWith('no such role');

    await roleContract.connect(superadmin).grantRole(defaultAdmin, user.address);

    await roleContract.connect(user).pause();

    // await roleContract.connect(superadmin).revokeRole(defaultAdmin, user.address);

    // await roleContract.connect(user).pause();

    // await roleContract.connect(withdrawer).pause();
  });
});