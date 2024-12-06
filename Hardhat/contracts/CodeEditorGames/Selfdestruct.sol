// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract EmptyContract {
    // This contract has no state or logic.
}

contract Attack {
    function attack(address _addr) public payable {
        address payable addr = payable(address(EmptyContract(_addr)));
        selfdestruct(addr);
    }
}