import { expect } from "chai";
import { ethers } from "hardhat";

describe("CallMeChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("CallMeChallenge");
    const contract = await factory.deploy();
    await contract.deployed();

    const tx = await contract.callme();
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
