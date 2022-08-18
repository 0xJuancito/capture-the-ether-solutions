import { expect } from "chai";
import { ethers } from "hardhat";

const { utils } = ethers;

describe("GuessTheNewNumberChallenge", () => {
  it("Solves the challenge", async () => {
    const challengeFactory = await ethers.getContractFactory("GuessTheNewNumberChallenge");
    const challengeContract = await challengeFactory.deploy({ value: utils.parseEther("1") });
    await challengeContract.deployed();

    const attackFactory = await ethers.getContractFactory("GuessTheNewNumberAttack");
    const attackContract = await attackFactory.deploy(challengeContract.address);
    await attackContract.deployed();

    const tx = await attackContract.attack({ value: utils.parseEther("1") });
    await tx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
