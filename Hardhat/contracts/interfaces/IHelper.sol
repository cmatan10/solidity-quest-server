// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IHelper {
    function mintRequirements(
        uint16 id,
        address _entity,
        address player
    ) external view returns (bool);

    function getMaxGame() external view returns (uint256);
}
