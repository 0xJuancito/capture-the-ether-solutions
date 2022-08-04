import { task } from "hardhat/config";

const contractAddress = '0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee';

task("choose-a-nickname", "Solves the 'Call Me' challenge", async (taskArgs: {nickname: string}, hre) => {
  const factory = await hre.ethers.getContractFactory('CaptureTheEther');
  const contract = factory.attach(contractAddress);

  const nickname = hre.ethers.utils.formatBytes32String(taskArgs.nickname)
  const tx = await contract.setNickname(nickname);
  await tx.wait();
}).addPositionalParam("nickname");
