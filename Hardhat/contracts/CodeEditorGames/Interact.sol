// SPDX-License-Identifier: MIT

pragma solidity >= 0.8.20;

contract FOO {
    uint public timeStamp;
    function setTimeStamp (uint _timeStamp) external{
        require(block.timestamp == _timeStamp, "it's not the correct time stamp");
        timeStamp = _timeStamp;
    }
}

contract BAR{
    function interact(address _addr) external {
        FOO(_addr).setTimeStamp(block.timestamp);
    }
}
