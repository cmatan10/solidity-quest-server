// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SecretData {
    
    bytes32 public hexadecimal = 0x48656c6c6f210000000000000000000000000000000000000000000000000000;

    address public creator;
    uint96 public number = 1000;

    uint256 public bigNumber = 1000000000;

    string public str = "I am public";

    string[] private array;

    bool public secretRevealed;

    constructor(string memory _itsNotThePassword, string memory _itsThePassword){
        creator = msg.sender;
        array.push(_itsNotThePassword);
        array.push(_itsThePassword);
    }

    function Reveale(string memory _secret) public {
        require(keccak256(abi.encodePacked(_secret)) == keccak256(abi.encodePacked(array[1])), "Secret does not match");
        secretRevealed = true;
    }
}

/*
async function getArray() {

  const baseSlot = web3.utils.keccak256(web3.utils.padLeft(4, 64));

  const elementSlot = web3.utils.toBN(baseSlot).add(web3.utils.toBN(1)).toString(10);

  const elementData = await web3.eth.getStorageAt(contractAddress, elementSlot);

  const elementString = web3.utils.hexToUtf8(elementData).replace(/\0/g, '');

  console.log(elementString);
}
 */