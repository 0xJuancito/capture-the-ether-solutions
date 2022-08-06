import { expect } from "chai";
import { ethers } from "hardhat";

const { utils, provider } = ethers;

describe("GuessTheNumberChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("GuessTheNumberChallenge");
    const contract = await factory.deploy({ value: utils.parseEther("1") });
    await contract.deployed();

    const tx = await contract.guess(42, { value: utils.parseEther("1") });
    await tx.wait();

    expect(await provider.getBalance(contract.address)).to.equal(0);
  });
});
