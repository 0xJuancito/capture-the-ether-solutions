import { utils } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x972890fb5ca81cE786E73A64f4dF5370b3c9692d";

task("guess-the-number", "Solves the 'Guess the Number' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory("GuessTheNumberChallenge");
  const contract = factory.attach(contractAddress);

  const tx = await contract.guess(42, { value: utils.parseEther("1") });
  await tx.wait();
});
