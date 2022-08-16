import { expect } from "chai";
import { ethers } from "hardhat";

describe("AssumeOwnershipChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("AssumeOwnershipChallenge");
    const contract = await factory.deploy();
    await contract.deployed();

    let tx;
    tx = await contract.AssumeOwmershipChallenge();
    await tx.wait();

    tx = await contract.authenticate();
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
