// SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

// ---------------------------------------- mission:

// [
// 	{
// 		"inputs": [],
// 		"name": "Ihacker",
// 		"outputs": [
// 			{
// 				"internalType": "string",
// 				"name": "",
// 				"type": "string"
// 			}
// 		],
// 		"stateMutability": "pure",
// 		"type": "function"
// 	}
// ]


// ---------------------------------------- solution:

contract ABI {
    function Ihacker() external pure returns (string memory) {
        return "I am hacker";
    }
}

// ---------------------------------------- check:

contract ContractChecker {
    function checkIhackerFunction(address contractAddress)
        external
        view
        returns (bool)
    {
        bytes4 selector = bytes4(keccak256("Ihacker()"));

        (bool success, bytes memory result) = contractAddress.staticcall(
            abi.encodeWithSelector(selector)
        );

        if (success) {
            string memory returnedString = abi.decode(result, (string));
            if (
                keccak256(bytes(returnedString)) ==
                keccak256(bytes("I am hacker"))
            ) {
                return true;
            }
        }
        return false;
    }
}
