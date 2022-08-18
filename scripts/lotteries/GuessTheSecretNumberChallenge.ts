import { utils } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0xbEcE95cBe47b21beCC13aE1db5CA41aca11C437E";

task("guess-the-secret-number", "Solves the 'Guess the Secret Number' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory("GuessTheSecretNumberChallenge");
  const contract = factory.attach(contractAddress);

  const secretNumber = 170; // Obtained after brute-forcing the hash
  const tx = await contract.guess(secretNumber, { value: utils.parseEther("1") });
  await tx.wait();
});
