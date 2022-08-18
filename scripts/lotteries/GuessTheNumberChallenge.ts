import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x972890fb5ca81cE786E73A64f4dF5370b3c9692d";

async function main() {
  const factory = await ethers.getContractFactory("GuessTheNumberChallenge");
  const contract = factory.attach(contractAddress);

  const tx = await contract.guess(42, { value: utils.parseEther("1") });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
