import { ethers } from "hardhat";

const contractAddress = "0x91A3C24BE94016a6a407c5cd6A13062B79b33E7f";

async function main() {
  const factory = await ethers.getContractFactory("DeployChallenge");
  const contract = factory.attach(contractAddress);
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
