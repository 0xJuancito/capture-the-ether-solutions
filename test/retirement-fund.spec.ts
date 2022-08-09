import { expect } from "chai";
import { utils } from "ethers";
import { ethers } from "hardhat";

describe("RetirementFundChallenge", () => {
  it("Solves the challenge", async () => {
    const myAddress = ethers.provider.getSigner().getAddress();
    const challengeFactory = await ethers.getContractFactory("RetirementFundChallenge");
    const challengeContract = await challengeFactory.deploy(myAddress, { value: utils.parseEther("1") });
    await challengeContract.deployed();

    const attackFactory = await ethers.getContractFactory("RetirementFundAttack");
    const attackContract = await attackFactory.deploy(challengeContract.address, { value: 1 });
    await attackContract.deployed();

    const tx = await challengeContract.collectPenalty();
    await tx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
