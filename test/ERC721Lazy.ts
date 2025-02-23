// import { loadFixture, ethers, SignerWithAddress, expect } from "./setup";
// import type { LazyNFT } from "../typechain";
// import { parseEther } from "ethers";

// interface LazyRedeemMessage {
//     tokenId: number | string;
//     minPrice: bigint;
//     uri: string;
// }

// interface RSV { 
//     r: string;
//     s: string;
//     v: number;
// }

// interface Domain {
//     name: string;
//     version: string;
//     chainId: number;
//     verifyingContract: string;
// }

// function splitSignatureToRSV(signature: string): RSV {
//     const r = '0x' + signature.substring(2).substring(0, 64);
//     const s = '0x' + signature.substring(2).substring(64, 128);
//     const v = parseInt(signature.substring(2).substring(128, 130), 16);
  
//     return { r, s, v };
// }

// const signLazyMint = async (
//     token: string,
//     tokenId: string | number,
//     minPrice: bigint,
//     uri: string,
//     signer: SignerWithAddress
// ): Promise<LazyRedeemMessage & RSV> => {
//     const message: LazyRedeemMessage = {
//         tokenId,
//         minPrice,
//         uri,
//     };

//     const network = await ethers.provider.getNetwork();
//    const chainId = network.chainId;  

//     const domain: Domain = {
//         name: "UnityFlow",
//         version: "1",
//         chainId: Number(chainId),
//         verifyingContract: token,
//     };

//     const typedData = createTypedData(message, domain);

//     const rawSignature = await signer.signTypedData(
//         typedData.domain,
//         typedData.types,
//         typedData.message
//     );

//     const sig = splitSignatureToRSV(rawSignature);

//     return { ...sig, ...message };
// }

// function createTypedData(message: LazyRedeemMessage, domain: Domain) {
//     return {
//       types: {
//         NFTVoucher: [
//           { name: "tokenId", type: "uint256" },
//           { name: "minPrice", type: "uint256" },
//           { name: "uri", type: "string" },
//         ]
//       },
//       primaryType: "NFTVoucher",
//       domain,
//       message,
//     };
// }

// describe("LazyNFT", function() {
//     async function deploy() {
//       const [ owner, spender ] = await ethers.getSigners();
  
//       const Factory = await ethers.getContractFactory("LazyNFT");
//       const token: LazyNFT = await Factory.deploy("UnityFlow", "UF");
  
//       return { token, owner, spender }
//     }
  
//     it("should redeem", async function() {
//       const { token, owner, spender } = await loadFixture(deploy);
  
//       const tokenAddr = token.target.toString();
//       const ownerAddr = owner.address;
//       const redeemerAddr = spender.address;
//       const tokenId = 1;
//       const minPrice = parseEther("10");
//       const uri = "https://loremflickr.com/400/250?random=1";
  
//       const result = await signLazyMint(
//         tokenAddr,
//         tokenId,
//         BigInt(minPrice),
//         uri,
//         owner,
//       );

//       console.log(result);

//       const tx = await token.connect(spender).redeem(
//         ownerAddr, 
//         redeemerAddr, 
//         result.tokenId, 
//         result.minPrice, 
//         result.uri, 
//         result.v, 
//         result.r, 
//         result.s,
//         { value: minPrice }
//       );
//       await tx.wait();

//       expect(await token.ownerOf(tokenId)).to.equal(redeemerAddr);
//       expect(await token.availableToWithdraw(ownerAddr)).to.equal(minPrice);
//       expect(await token.tokenURI(tokenId)).to.eq(uri);
//     });
// });