import { Contract, Signer } from "ethers";
import { task } from "hardhat/config";

let accounts: Signer[];
let eoa: Signer;
let contract: Contract;
let tx;

task("account-takeover", "Solves the 'Account Takeover' challenge", async (_taskArgs, hre) => {
  accounts = await hre.ethers.getSigners();
  [eoa] = accounts;
  const challengeFactory = await hre.ethers.getContractFactory("AccountTakeoverChallenge");
  contract = challengeFactory.attach(`0xc138f81F5D58b6CD39ac8a5D2F2E487Ad5B67E1e`);

  const signer = new hre.ethers.Wallet(
    `0x614f5e36cd55ddab0947d1723693fef5456e5bee24738ba90bd33c0c6e68e269`,
    eoa.provider,
  );

  tx = await eoa.sendTransaction({
    to: signer.address,
    value: hre.ethers.utils.parseEther(`0.1`),
  });
  await signer.provider.waitForTransaction(tx.hash);
  tx = await contract.connect(signer).authenticate();
  await tx.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
});
