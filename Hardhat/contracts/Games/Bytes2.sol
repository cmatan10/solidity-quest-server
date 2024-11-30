// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Bytes2 {
    bytes2 public num = 0;

    function increaseNum(bytes2 _biggerNum) external {
        require(_biggerNum != bytes2(0), "biggerNum cannot be zero");
        num = _biggerNum;
    }
}
