# Choose a nickname

This one is similar to the [Call me](./call-me.md) challenge, as the goal is to run a function in a smart contract. The difference is that in this case we have to provide a nickname argument to the function.

The second issue to observe is that the `setNicknamea` function expects a `bytes32`, so we have to convert any string to it before executing the function.

I've created a task [choose-a-nickname](../tasks/choose-a-nickname.ts) that requires a nickname argument

Run `npx hardhat --network ropsten choose-a-nickname my-fancy-nickname` to complete the challenge
