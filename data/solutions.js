const solutions = {
  1: `- Any number between \`0x0001\` and \`0xFFFF\` can be entered in the \`_biggerNum\` input box.

- Press the \`increaseNum\` button and confirm the transaction.`,

  2: `- Copy the smart contract address code and paste it into a new file in the Remix IDE.

- In Remix IDE, click the \`Deploy & RUN TRANSACTIONS\` tab, then click the select box under the \`ENVIRONMENT\` heading and select the \`Injected Provider: MetaMask\` option.

- Copy the smart contract address, which is under the heading \`Your Test Address\`. Navigate to Remix IDE, and paste the contract address in the \`At Address\` input box. 
    Next, click the \`At Address\` button to enable access to the deployed smart contract's user interface.

- Now click on the newly created tab under the heading \`Deployed Contracts\`, then click on the \`Transact\` button, which is under the heading \`CALLDATA\`, and confirm the transaction.

- To verify that the transaction was successfully completed, click the \`FixMe\` button in Remix IDE or on the game website and check that the value has changed to \`true\`.

- Navigate to the game site and click the \`Submit\` button.`,
  3: `- Select a wallet address or contract address and copy it (don't select your wallet address as your wallet balance will change once you call the function).

  - Enter the address you copied into the \`_account\` input box.
  
  - Open the code editor you use and create an \`index.js\` file with the following code:
  
\`\`\`javascript
  const Web3 = require('web3');
       const https = '< your-rpc-provider >';
  const web3 = new Web3(https);
  
  async function balance(){
             const bal = await web3.eth.getBalance("< paste-address-here >");
    console.log(bal);
  }
  balance();
\`\`\`
  
  - Replace \`<your-rpc-provider>\` with your RPC provider URL and \`<paste-address-here>\` with the copied address.
  
  -- Run the script using \`node index.js\` to view the balance in the console.`,

  4: `- Copy the smart contract code address and paste it into a new file in the Remix IDE.

  - In Remix IDE, click the \`DEPLOY & RUN TRANSACTIONS\` tab, then click the select box under the \`ENVIRONMENT\` heading and select the \`Injected Provider: MetaMask\` option.
  
  - Copy the smart contract address, which is under the heading \`Your Test Address\`. Navigate to Remix IDE, and paste the contract address in the \`At Address\` input box. 
      Next, click the \`At Address\` button to enable access to the deployed smart contract's user interface.
  
  - Enter the number 1 in the input box under the heading \`VALUE\`, ensuring that the \`ETHEREUM UNIT\` is set to Wei.
  
  - Now click on the newly created tab under the heading \`Deployed Contracts\`, then click on the \`Transact\` button under the heading \`CALLDATA\` and confirm the transaction.
  
  - To verify that the transaction was successfully completed, note that the amount of ETH sent to the contract is equal to \`Balance: 0.000000000000000001 ETH\`.
  
  - Navigate to the game site and click the \`Submit\` button.`,

  5: `- Click the hint button and copy the hash that represents the newly deployed contract, and paste it into the search box on the block explorer.

- Copy the block number.

- Open the code editor you use and create an \`index.js\` file with the following code:

\`\`\`javascript
const Web3 = require('web3');
const https = '< your-rpc-provider >'
const web3 = new Web3(https);
web3.eth.getBlock("< Block-Number >", console.log)
\`\`\`

- Replace \`<Block-Number>\` with the block number you copied.

- Run the script and copy the timestamp from the received output.

- Navigate to the game site, enter the timestamp you copied into the \`_Timestamp\` input box, and press the \`timeReset\` button, then confirm the transaction.`,

  6: `1. **Base Gas Consumption (Overhead)**: When the \`complexOperation\` function is called with the argument \`0\`, it consumes a certain amount of gas, let's call it \`x\` units. 
          This \`x\` represents the base gas cost for executing the function without entering the loop. 
   It's includes the cost of reading and writing to storage, and other computational overheads.

2. **Gas Consumption for a Single Iteration**: When you invoke the function with an argument of \`1\`, it results in a gas consumption of \`y\` units. 
          This includes the base gas cost \`x\` plus the gas cost of one iteration of the loop.

Using the above data:
\`\`\`
Gas Per Iteration = y - x = z units
\`\`\`

Average Gas Consumption = (3000 + 5000) / 2 = 4000 units
\`\`\`

Applying this to our function's gas consumption pattern:
\`\`\`
x + z*n = 4000
=> z*n = 4000 - x
=> n ≈ (4000 - x) / z
\`\`\`

Thus, it is deduced that about \`n\` iterations are requisite to approach an average gas consumption of 4000 units.

- Enter the number \`n\` in the \`iterations\` input box.

- Click the \`complexOperation\` button and confirm the transaction.`,

  7: `- Copy the smart contract address, which is under the heading \`Your Test Address\`.

- Open the code editor you use and create an \`index.js\` file with the following code:

\`\`\`javascript
const Web3 = require('web3');
const https = '< your-rpc-provider >';
const web3 = new Web3(https);
web3.eth.getStorageAt("< contract-address >", 0, console.log);
\`\`\`

- Replace \`<contract-address>\` with the smart contract address you copied.

- Run the script and copy the hexadecimal number from the received output.

- Enter the hexadecimal number in the input box \`_password\`.

- Enter any number in the \`newPassword\` input box.

- Click the \`changePassword\` button and confirm the transaction.`,

  8: `\`type(uint256).max\` = Max

\`(counter = Max - 3)[---------(counter + 3 = Max)---(counter + 4 = 0)---------](counter + 7 = 3)\`

When the \`counter\` starts at \`Max - 3\`, the overflow logic is:

1. When \`3\` uints are added to the counter, it reaches \`Max\`.
2. Adding to the starting value \`4\` causes an overflow, resetting the counter to \`0\`.
3. If \`7\` is added to the starting value, the counter wraps around and becomes \`3\`.

- Enter the number \`7\` in the \`value\` input box.

- Click the \`add\` button and confirm the transaction.`,

  9: `- Click the hint button, copy the hash that represents the newly deployed contract, and paste it into the search box on the block explorer.

- Click on the block number.

- Copy the block number.

- Navigate to the game site and enter the block number you copied into the \`blockNumber\` input box.

- Copy the hash that represents the block.

- Navigate to the game site and enter the hash you copied into the \`blockHash\` input box.

- Click the \`blockHashCheck\` button and confirm the transaction.`,

  10: `- Copy the following code and paste it into a new file in the Remix IDE:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Result {
    function res() public pure returns(bytes4) {
        return bytes4(keccak256("CalcMe(bytes4)"));
    }
}
\`\`\`

- Deploy the \`Result\` contract.

- Call the \`res\` function and copy the \`bytes4\` value that you received.

- Navigate back to the game site and paste the value in the \`ID\` input box.

- Press the \`CalcMe\` button and confirm the transaction.`,

  11: `- Copy the following code and paste it into a new file in the Remix IDE:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Result {
    function res() public pure returns (bytes memory) {
        bytes memory encodedData = abi.encode("WEB", 3);
        return encodedData;
    }
}
\`\`\`

- Deploy the \`Result\` contract.

- Call the \`res\` function and copy the \`encodedData\` value that you received.

- Navigate back to the game site and paste the value in the \`encodedData\` input box.

- Click the \`encode\` button and confirm the transaction.`,

  12: `- Copy the following code and paste it into a new file in the Remix IDE:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Result {
    function res() public pure returns (bytes memory secret) {
        secret = abi.encodePacked(sha256("secret"));
        return secret;
    }
}
\`\`\`

- Deploy the \`Result\` contract.

- Call the \`res\` function and copy the \`secret\` value that you received.

- Navigate back to the game site and paste the value in the \`guess\` input box.

- Click the \`findCollision\` button and confirm the transaction.`,

  13: `- Copy the following code and paste it into a new file in the Remix IDE:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Result {
    bytes public encodeStringAndUint = hex"00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000b4920416d204e756d626572000000000000000000000000000000000000000000";
    function res() public view returns (string memory, uint256) {
        (string memory decodedStr, uint256 decodedNum) = abi.decode(
            encodeStringAndUint,
            (string, uint256)
        );
        return (decodedStr, decodedNum);
    }
}
\`\`\`

- Deploy the \`Result\` contract.

- Call the \`res\` function and copy the \`string\` value and the \`uint256\` value that you received.

- Navigate back to the game site, paste the \`string\` value in the \`_str\` input box and the \`uint256\` value in the \`_num\` input box.

- Press the \`decode\` button and confirm the transaction.`,

  14: `- Copy the smart contract address, which is under the heading \`Your Test Address\` and paste it in the input box \`_addr\`.

- Enter the number \`1\` in the \`_sal\` input box.

- Press the \`bytecode\` button and copy the bytecode that appears on the screen.

- Paste the bytecode in the \`_bytecode\` input box.

- Click the \`checkAddress\` button and copy the smart contract address that appears on the screen.

- Paste the smart contract address in the \`_add\` input box.

- Click the \`deploy\` button and confirm the transaction.`,

  15: `- Copy the following code and paste it into a new file in the Remix IDE:

\`\`\`solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract Result {
    bytes4 public res = bytes4(keccak256("calcFunc1(uint)")) 
        ^ bytes4(keccak256("calcFunc2(bool)")) 
        ^ bytes4(keccak256("calculateXOR(bytes4)"));
}
\`\`\`

- Deploy the \`Result\` contract.

- Read the \`res\` state variable and copy the \`bytes4\` value that you received.

- Navigate back to the game site and paste the value in the \`ID\` input box.

- Click the \`calculateXOR\` button and confirm the transaction.`,

  16: `- Copy the smart contract address, which is under the heading \`LimitedTickets Address\` and paste it in the input box \`_target\`.

- Copy your digital wallet address (which appears in the navbar) and paste it into the \`attacker\` input box.

- Enter the number \`3\` in the \`ticketAmount\` input box.

- Press the \`attack\` button and confirm the transaction (do it twice).

- Click the \`Submit\` button and confirm the transaction.`,

  17: `- Copy the smart contract address, which is under the heading \`EducatedGuess Address\`, and paste it in the \`_target\` input box.

- Copy the smart contract address, which is under the heading \`HackEducatedGuess Address\` and paste it into the \`attackerContract\` input box.

- Enter the number \`1000\` in the \`num\` input box.

- Click the \`attack\` button and confirm the transaction.

- Click the \`Submit\` button and confirm the transaction.`,

  18: `- Call the \`increaseWithCheck\` function and note the \`gasUsed\` value returned.

- Call the \`increaseWithoutCheck\` function and note the \`gasUsed\` value returned.

- Calculate the absolute gas difference:
\`\`\`
 Gas Difference = |gasUsed (with check) - gasUsed (without check)|
\`\`\`
- Enter the calculated gas difference in the input box.

- Click the \`Submit Gas Difference\` button and confirm the transaction.`,
};

module.exports = { solutions };

