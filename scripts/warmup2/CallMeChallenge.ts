import { ethers } from "hardhat";

const contractAddress = "0xdF5c182084B7dBdcca5257DC5cd829Cb14970B6a";

async function main() {
  const factory = await ethers.getContractFactory("CallMeChallenge");
  const contract = factory.attach(contractAddress);

  const tx = await contract.callme();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
