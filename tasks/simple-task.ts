// import { formatEther, parseEther } from "ethers";
// import { BaseContract, BaseContract__factory } from "../typechain";
// import { task, types } from "hardhat/config";

// // BaseContract 0x5FbDB2315678afecb367f032d93F642f64180aa3

// task("balance", "Displays balance")
//   .addParam("account", "Acount Address")
//   .addOptionalParam("greeting", "Greeting to print", "base hello", types.string)
//   .setAction(async ({ account, greeting }, { ethers }) => {
//     const balance = ethers.provider.getBalance(account);
//     console.log(
//       `Balance: ${ethers.formatEther((await balance).toString())} ETH`
//     );
//   });

// task("callme", "Call contract func")
//   .addParam("contract", "contract address")
//   .addOptionalParam("account", "account name", "deployer", types.string)
//   .setAction(async ({ contract, account }, { ethers, getNamedAccounts }) => {
//     const signerAddress = (await getNamedAccounts())[account];
//     const signer = await ethers.getSigner(signerAddress);

//     const baseContract = BaseContract__factory.connect(contract, signer);

//     console.log(await baseContract.callme());
//   });

// task("pay", "Call pay func")
//   .addParam(
//     "contract",
//     "contract address",
//     "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//   )
//   .addParam("value", "Value in ETH", 0, types.int)
//   .addOptionalParam("account", "account name", "deployer", types.string)
//   .setAction(
//     async ({ contract, value, account }, { ethers, getNamedAccounts }) => {
//       const signerAddress = (await getNamedAccounts())[account];
//       const signer = await ethers.getSigner(signerAddress);

//       const baseContract = await ethers.getContractAt(
//         "BaseContract",
//         contract,
//         signer
//       );

//       const tx = await baseContract.pay(`hello from ${signerAddress}`, {
//         value: parseEther(value.toString()),
//       });

//       await tx.wait();

//       console.log("contract balance: ");
//       console.log(
//         formatEther(await ethers.provider.getBalance(baseContract.target))
//       );

//       console.log("signer balance: ");
//       console.log(formatEther(await ethers.provider.getBalance(signerAddress)));
//     }
//   );

// task("distribute", "Call distribute func")
//   .addParam(
//     "contract",
//     "contract address",
//     "0x5FbDB2315678afecb367f032d93F642f64180aa3"
//   )
//   .addOptionalParam("account", "account name", "deployer", types.string)
//   .addParam("addresses", "addresses to distribute")
//   .setAction(
//     async ({ addresses, contract, account }, { ethers, getNamedAccounts }) => {
//       const signerAddress = (await getNamedAccounts())[account];
//       const signer = await ethers.getSigner(signerAddress);

//       const baseContract = await ethers.getContractAt(
//         "BaseContract",
//         contract,
//         signer
//       );

//       const addrs = addresses.split(",");

//       console.log("contract balance before: ");
//       console.log(
//         formatEther(await ethers.provider.getBalance(baseContract.target))
//       );

//       const tx = await baseContract.distribute(addrs);
//       await tx.wait();

//       await Promise.all(
//         addrs.map(async (addr) => {
//           console.log(formatEther(await ethers.provider.getBalance(addr)));
//         })
//       );

//       console.log("contract balance after: ");
//       console.log(
//         formatEther(await ethers.provider.getBalance(baseContract.target))
//       );
//       console.log(await baseContract.callme());
//     }
//   );
