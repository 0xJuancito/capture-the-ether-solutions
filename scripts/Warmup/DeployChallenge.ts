import { ethers } from "hardhat";

const address = "0x91A3C24BE94016a6a407c5cd6A13062B79b33E7f";

async function main() {
  const contractFactory = await ethers.getContractFactory("DeployChallenge");
  const contract = contractFactory.attach(address);
  await contract.deployed();

  console.log("Contract deployed to:", contract.address);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
