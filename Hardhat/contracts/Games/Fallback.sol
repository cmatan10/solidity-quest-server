// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Fallback {
    uint8 num = 0;

    function fixMe() external view returns (bool) {
        return num == 1;
    }

    fallback() external {
        num = 1;
    }
}
