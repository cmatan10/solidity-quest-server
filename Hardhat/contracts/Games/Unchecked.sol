// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Unchecked {
    bool public correctCalc = false;

    function increaseWithCheck()
        public
        view
        returns (uint256 gasUsed, uint256 num)
    {
        uint256 Num = 0;
        uint256 gasStart = gasleft();
        Num++;
        gasUsed = gasStart - gasleft();
        num = Num;
    }

    function increaseWithoutCheck()
        public
        view
        returns (uint256 gasUsed, uint256 num)
    {
        uint256 Num = 0;
        uint256 gasStart = gasleft();
        unchecked {
            Num++;
        }
        gasUsed = gasStart - gasleft();
        num = Num;
    }

    function calculateGasDifference(uint256 _userDifference) external {
        (uint256 gasChecked, ) = increaseWithCheck();
        (uint256 gasUnchecked, ) = increaseWithoutCheck();
        uint256 actualDifference = gasChecked > gasUnchecked
            ? gasChecked - gasUnchecked
            : gasUnchecked - gasChecked;
        require(
            _userDifference == actualDifference,
            "Incorrect gas difference calculation"
        );
        correctCalc = true;
    }
}
