const hints = {
  1: `Each hexadecimal digit represents four binary bits, 
        and a bytes2 consists of sixteen bits. 
        It requires four hexadecimal digits to represent all possible values.`,
  2: `Interact with the contract using Remix, 
  and remember that the fallback function is executed on a call to the contract if none of the other functions 
  match the given function signature or if no data was supplied at all and there is no receive Ether function.
  The fallback function always receives data, but in order to also receive Ether it must be marked payable.`,
  3: 'Check how to Get the balance of an address at a given block.',
  4: 'Interact with the contract using Remix. The receive function is triggered by plain Ether transfers without calldata.',
  5: 'You will find the block number in the block explorer by using the hash below. Use the Web3 getBlock function to retrieve timestamp details.',
  6: 'Try to figure out how much gas is required for one iteration, so you can estimate how many iterations the loop will take to consume gas in the range of 3000 to 5000.',
  7: 'Understand how Solidity’s private variables are stored and accessed.',
  8: 'Refer to Solidity documentation on integer overflow handling in version ^0.8.0.',
  9: 'You will find the block number in the block explorer by this hash:',
  10: `Write a function according to the following interface: function Calc() external pure returns (bytes4); 
       Or calculate the function signature at the following link:`,
  11: `Write a function as follows: function encode(string memory _str, uint256 _num) external pure returns (bytes memory);
       Alternatively, use the encodeparameters function from the web3js library. `,
  12: `Write a function according to the following interface:
       function guess() external pure returns (bytes memory secret);`,
  13: 'Write a function as follows: function decode(bytes memory encodedData) external pure returns (string memory, uint256); Alternatively, Use the decodeparameters function from the web3js library.',
  14: 'Calculate the deployed address: keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, keccak256(bytecode))).',
  15: 'Write a function as follows: function calculateXOR() public pure returns(bytes4); Alternatively, calculate the function signatures and XOR values',
  16: 'Consider how the "claimTickets" function tracks ticket count. When the attacker contract calls this function, it"s defined as the msg.sender. Even though the tickets are transferred to your address through the attacker contract, the balance of the attacker contract will always remain at zero tickets.',
  17: 'Consider how external factors, such as the block.timestamp, can influence the generation of a "random" number.',
  18: 'To calculate the gas difference, execute both functions to get their gas usages and subtract them. Remember that "unchecked" operations consume less gas as they skip certain checks.',

};

module.exports = { hints };
