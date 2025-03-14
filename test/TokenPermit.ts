// import { loadFixture, ethers, SignerWithAddress, expect } from "./setup";
// import type { MyToken, Proxy} from "../typechain";

// interface ERC2612PermitMessage {
//   owner: string;
//   spender: string;
//   value: number | string;
//   nonce: number | string;
//   deadline: number | string;
// }
  
// interface RSV { 
//   r: string;
//   s: string;
//   v: number;
// }
  
// interface Domain {
//   name: string;
//   version: string;
//   chainId: number;
//   verifyingContract: string;
// }
  
// function createTypedERC2612Data(message: ERC2612PermitMessage, domain: Domain) {
//   return {
//     types: {
//       Permit: [
//         { name: "owner", type: "address" },
//         { name: "spender", type: "address" },
//         { name: "value", type: "uint256" }, 
//         { name: "nonce", type: "uint256" },
//         { name: "deadline", type: "uint256" },
//       ]
//     },
//     primaryType: "Permit",
//     domain,
//     message,
//   };
// }
  
// function splitSignatureToRSV(signature: string): RSV {
//   const r = '0x' + signature.substring(2).substring(0, 64);
//   const s = '0x' + signature.substring(2).substring(64, 128);
//   const v = parseInt(signature.substring(2).substring(128, 130), 16);
  
//   return { r, s, v };
// }

// async function signERC2612Permit(
//   token: string,
//   owner: string,
//   spender: string,
//   value: string | number,
//   deadline: number,
//   nonce: number,
//   signer: SignerWithAddress
// ): Promise<ERC2612PermitMessage & RSV> {
//   const message: ERC2612PermitMessage = {
//     owner,
//     spender,
//     value,
//     nonce,
//     deadline,
//   };

//   const network = await ethers.provider.getNetwork();
//   const chainId = network.chainId;  
  
//   const domain: Domain = {
//     name: "MyToken",
//     version: "1",
//     chainId: Number(chainId),
//     verifyingContract: token,
//   };
  
//   const typedData = createTypedERC2612Data(message, domain);
  
//   console.log(typedData);
  
//   const rawSignature = await signer.signTypedData(
//     typedData.domain,
//     typedData.types,
//     typedData.message
//   );
  
//   const sig = splitSignatureToRSV(rawSignature);
  
//   return { ...sig, ...message };
// }

// describe("MyToken", function() {
//     async function deploy() {
//       const [ owner, spender ] = await ethers.getSigners();
  
//       const Factory = await ethers.getContractFactory("MyToken");
//       const token: MyToken = await Factory.deploy();
  
//       const PFactory = await ethers.getContractFactory("Proxy");
//       const proxy: Proxy = await PFactory.deploy();
  
//       return { token, proxy, owner, spender }
//     }
  
//     it("should permit", async function() {
//       const { token, proxy, owner, spender } = await loadFixture(deploy);
  
//       const tokenAddr = token.target.toString();
//       const amount = 100;
//       const deadline = Math.floor(Date.now() / 1000) + 1000;
//       const nonce = 0;
  
//       const result = await signERC2612Permit(
//         tokenAddr,
//         owner.address.toString(),
//         spender.address.toString(),
//         amount,
//         deadline,
//         nonce,
//         owner
//       );
  
//       console.log(result);
  
//       const tx = await proxy.connect(spender).doSend(
//         tokenAddr,
//         owner.address,
//         spender.address,
//         amount,
//         deadline,
//         result.v,
//         result.r,
//         result.s,
//       );
//       await tx.wait();
  
//       console.log("NONCES", await token.nonces(owner));
  
//       console.log("ALLOWANCE BEFORE", await token.allowance(owner, spender));
  
//       const transferTx = await token.connect(spender).transferFrom(owner, spender, 85);
//       await transferTx.wait();
  
//       await expect(transferTx).to.changeTokenBalance(token, spender, 85);
  
//       console.log("ALLOWANCE AFTER", await token.allowance(owner, spender));
//     });
//   });