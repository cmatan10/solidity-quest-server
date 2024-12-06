// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

contract TryCallMe {
    bool public called = false;
    function TryToCall() external {
        require(msg.sender != tx.origin, "no eoa wallet allowed");
        require((msg.sender).code.length == 0, "no contract allowed");
        called = true;
    }
}

contract trying {
    constructor(address _target) {
        TryCallMe(_target).TryToCall();
    }
}