import { expect } from "chai";
import { ethers } from "hardhat";

const { utils } = ethers;

describe("GuessTheRandomNumberChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("GuessTheRandomNumberChallenge");
    const contract = await factory.deploy({ value: utils.parseEther("1") });
    await contract.deployed();

    const secretNumber = await contract.provider.getStorageAt(contract.address, 0);
    const tx = await contract.guess(secretNumber, { value: utils.parseEther("1") });
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
