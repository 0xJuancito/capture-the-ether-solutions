import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0xbEcE95cBe47b21beCC13aE1db5CA41aca11C437E";

async function main() {
  const factory = await ethers.getContractFactory("GuessTheSecretNumberChallenge");
  const contract = factory.attach(contractAddress);

  const secretNumber = 170; // Obtained after brute-forcing the hash
  const tx = await contract.guess(secretNumber, { value: utils.parseEther("1") });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
