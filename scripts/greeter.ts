import { ethers } from "hardhat";
import GreeterArtifact from "../artifacts/contracts/Greeter.sol/Greeter.json";

//  Contract address:    0x5fbdb2315678afecb367f032d93f642f64180aa3

async function main() {
  const signer = await ethers.getSigner(
    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  );
  const greeterAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

  const greeterContract = new ethers.Contract(
    greeterAddress,
    GreeterArtifact.abi,
    signer
  );

  const result = await greeterContract.setGreet("hello :) :) :) :) :) UPDATE");
  console.log(result);
  await result.wait();

  const greetPhrase = await greeterContract.getGreet();
  console.log(greetPhrase);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
