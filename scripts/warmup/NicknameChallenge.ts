import { ethers } from "hardhat";

const contractAddress = "0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee";

async function main() {
  const factory = await ethers.getContractFactory("CaptureTheEther");
  const contract = factory.attach(contractAddress);

  const nickname = ethers.utils.formatBytes32String("juancito");
  const tx = await contract.setNickname(nickname);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
