import { ethers } from "hardhat";
import { StockOptionsFactory__factory } from "../typechain-types";

async function main() {

  const signers = await ethers.getSigners();
  let signer = signers[0];
  const contractFactory = new StockOptionsFactory__factory(signer);
  const contract = await contractFactory.deploy();

  await contract.deployed();

  console.log("Stock Options Factory deployed to:", contract.address);

  console.log("calling createStockOptionsPlan()...");
  const tx = await contract.createStockOptionsPlan();
  const receipt = await tx.wait();
  if (receipt.events && receipt.events[0]) {
    console.log(`Address: ${receipt.events[0].address}`);
  } else {
    console.log('No events found');
  }
  

  console.log("calling the list of deployed contracts")
  const callTx = contract.getDeployedStockOptions();
  const txt = await callTx;
  console.log(txt)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
