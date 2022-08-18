import { Transaction } from "@ethereumjs/tx";
import { toBuffer } from "@ethereumjs/util";
import { ethers } from "hardhat";

const contractAddress = "0x36734BaDFCD15a8878c17a1a6ebF95655a509DFa";

async function main() {
  const challengeFactory = await ethers.getContractFactory("PublicKeyChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  const rawTx =
    "0xf87080843b9aca0083015f90946b477781b0e68031109f21887e6b5afeaaeb002b808c5468616e6b732c206d616e2129a0a5522718c0f95dde27f0827f55de836342ceda594d20458523dd71a539d52ad7a05710e64311d481764b5ae8ca691b05d14054782c7d489f3511a7abf2f5078962";

  const originalTx = Transaction.fromSerializedTx(toBuffer(rawTx), {});
  const publicKey = originalTx.getSenderPublicKey().toString("hex");

  const tx = await challengeContract.authenticate(`0x${publicKey}`, { gasLimit: 100000, maxPriorityFeePerGas: 1000 });
  await tx.wait();

  const isComplete = await challengeContract.isComplete();
  console.log(isComplete);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
