import { task } from "hardhat/config";

const contractAddress = '0xdF5c182084B7dBdcca5257DC5cd829Cb14970B6a';

task("call-me", "Solves the 'Call Me' challenge", async (_taskArgs, hre) => {
  const factory = await hre.ethers.getContractFactory('CallMeChallenge');
  const contract = factory.attach(contractAddress);

  const tx = await contract.callme();
  await tx.wait();
});
