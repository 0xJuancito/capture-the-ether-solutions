pragma solidity ^0.4.21;

contract DeployChallenge {
    // This tells the CaptureTheFlag contract that the challenge is complete.
    function isComplete() public pure returns (bool) {
        return true;
    }
}
