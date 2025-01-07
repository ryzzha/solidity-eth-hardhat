import { ethers, upgrades } from "hardhat";
import { expect } from "chai";
import { Signer } from "ethers";
import { UpgradeableNFT } from "../typechain";

describe("UpgradeableNFT", function () {
    let nft: UpgradeableNFT;
    let owner: Signer, addr1: Signer, addr2: Signer;
  
    beforeEach(async function () {
      const UpgradeableNFT = await ethers.getContractFactory("UpgradeableNFT");
      [owner, addr1, addr2] = await ethers.getSigners();
  
      nft = (await upgrades.deployProxy(
        UpgradeableNFT,
        ["UpgradeableNFT", "UNFT", await owner.getAddress()],
        { initializer: "initialize",  kind: 'uups' }
      )) as UpgradeableNFT;
    });

    it("should initialize correctly", async function () {
        expect(await nft.name()).to.equal("UpgradeableNFT");
        expect(await nft.symbol()).to.equal("UNFT");
        expect(await nft.owner()).to.equal(await owner.getAddress());
        expect(await nft.nextTokenId()).to.equal(1);
    });

    it("should allow the owner to mint NFTs", async function () {
        await nft.mint(await addr1.getAddress());
        await nft.mint(await addr2.getAddress());
        expect(await nft.balanceOf(await addr1.getAddress())).to.equal(1);
        expect(await nft.ownerOf(1)).to.equal(await addr1.getAddress());
        expect(await nft.nextTokenId()).to.equal(3);
    });

    it.skip("should revert minting by non-owner", async function () {
        await expect(nft.connect(addr1).mint(await addr1.getAddress())).to.be.revertedWith(
          "Ownable: caller is not the owner"
        );
    });

    it("should burn an NFT", async function () {
        await nft.mint(await addr1.getAddress());
        await nft.connect(addr1).transferFrom(await addr1.getAddress(), await owner.getAddress(), 1); 
        await nft.connect(owner).burn(1);
    
        await expect(nft.ownerOf(1)).to.be.revertedWithCustomError(nft, "ERC721NonexistentToken")
    });

    it("should upgrade the contract", async function () {
        const UpgradeableNFTV2 = await ethers.getContractFactory("UpgradeableNFT");
        const upgraded = await upgrades.upgradeProxy(nft.target, UpgradeableNFTV2);
    
        expect(upgraded.target).to.equal(nft.target);
    });
    
    it("should retain state after upgrade", async function () {
        await nft.mint(await addr1.getAddress());
    
        const UpgradeableNFTV2 = await ethers.getContractFactory("UpgradeableNFT");
        const upgraded = await upgrades.upgradeProxy(nft.target, UpgradeableNFTV2);
    
        expect(await upgraded.balanceOf(await addr1.getAddress())).to.equal(1);
        expect(await upgraded.ownerOf(1)).to.equal(await addr1.getAddress());
        expect(await upgraded.nextTokenId()).to.equal(2);
    });

    // it("should not allow unauthorized upgrades", async function () {
    //     const UpgradeableNFTV2 = await ethers.getContractFactory("UpgradeableNFT");
    
    //     await expect(
    //       upgrades.upgradeProxy(nft.target, UpgradeableNFTV2, { from: await addr1.getAddress() })
    //     ).to.be.revertedWith("Ownable: caller is not the owner");
    // });
})

