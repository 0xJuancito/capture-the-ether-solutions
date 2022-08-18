import { expect } from "chai";
import crypto from "crypto";
import { BigNumber, Wallet, utils } from "ethers";
import { ethers } from "hardhat";

function getWallet() {
  let wallet: Wallet;
  let contractAddress;
  let counter = 0;
  let privateKey;
  while (1) {
    privateKey = `0x${crypto.randomBytes(32).toString("hex")}`;
    wallet = new ethers.Wallet(privateKey);

    contractAddress = utils.getContractAddress({
      from: wallet.address,
      nonce: BigNumber.from("0"), // First deployed contract with this address
    });

    if (contractAddress.toLowerCase().includes("badc0de")) {
      console.log("found", privateKey);
      return wallet;
    }

    counter++;
    if (counter % 1000 === 0) {
      console.log(`checked ${counter} addresses`);
    }
  }
}

describe("FuzzyIdentityChallenge", () => {
  it("Solves the challenge", async () => {
    const challengeFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
    const challengeContract = await challengeFactory.deploy();
    await challengeContract.deployed();

    const [owner] = await ethers.getSigners();

    // const wallet = getWallet();
    const wallet = new Wallet("0xd9049714b21da5008b14de9ebe26051f79cab7025b3aba800a6a7fc4f4267973", owner.provider);

    let tx;
    tx = await owner.sendTransaction({
      to: wallet.address,
      value: utils.parseEther("0.1"),
    });
    await tx.wait();

    const attackFactory = await ethers.getContractFactory("FuzzyIdentityAttack");
    const attackContract = await attackFactory.connect(wallet).deploy(challengeContract.address);
    await attackContract.deployed();

    tx = await attackContract.attack();
    await tx.wait();

    expect(await challengeContract.isComplete()).to.be.true;
  });
});
