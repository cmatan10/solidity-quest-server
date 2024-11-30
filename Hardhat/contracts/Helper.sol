// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./Games/Fallback.sol";
import "./Games/InterfaceId.sol";
import "./Games/ChangePassword.sol";
import "./Games/DecodeData.sol";
import "./Games/EncodeData.sol";
import "./Games/Timestamp.sol";
import "./Games/Bytes2.sol";
import "./Games/BlockHash.sol";
import "./Games/BalanceChecker.sol";
import "./Games/PayableContract.sol";
import "./Games/Overflow.sol";
import "./Games/GasChecker.sol";
import "./Games/HashCollision.sol";
import "./Games/Factory.sol";
import "./Games/SupportInterface.sol";
import "./Games/EducatedGuess.sol";
import "./Games/LimitedTickets.sol";
import "./Games/Unchecked.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Helper is Initializable {
    function mintRequirements(
        uint16 id,
        address _entity,
        address player
    ) external view returns (bool) {
        if (id == 1) {
            // Check for Bytes2 game
            Bytes2 entity = Bytes2(_entity);
            require(entity.num() != 0, "You must pass level 1");
        } else if (id == 2) {
            // Check for Fallback game
            Fallback entity = Fallback(_entity);
            require(entity.fixMe(), "You must pass level 2");
        } else if (id == 3) {
            // Check for BalanceChecker game
            BalanceChecker entity = BalanceChecker(_entity);
            require(entity.correctBalanceChecked(), "You must pass level 3");
        } else if (id == 4) {
            // Check for PayableContract game
            PayableContract entity = PayableContract(payable(_entity));
            require(address(entity).balance > 0, "You must pass level 4");
        } else if (id == 5) {
            // Check for Timestamp game
            Timestamp entity = Timestamp(_entity);
            require(entity.success(), "You must pass level 5");
        } else if (id == 6) {
            // Check for GasChecker game
            GasChecker entity = GasChecker(_entity);
            require(entity.GasChecked(), "You must pass level 6");
        } else if (id == 7) {
            // Check for ChangePassword game
            ChangePassword entity = ChangePassword(_entity);
            require(entity.PreviousPassword(0) > 0, "You must pass level 7");
        } else if (id == 8) {
            // Check for Overflow game
            Overflow entity = Overflow(_entity);
            require(entity.overflowOccurred(), "You must pass level 8");
        } else if (id == 9) {
            // Check for BlockHash game
            BlockHash entity = BlockHash(_entity);
            require(entity.correctBlockHash(), "You must pass level 9");
        } else if (id == 10) {
            // Check for InterfaceId game
            InterfaceId entity = InterfaceId(_entity);
            require(entity.answer(), "You must pass level 10");
        } else if (id == 11) {
            // Check for EncodeData game
            EncodeData entity = EncodeData(_entity);
            require(
                entity._encodeStringAndUint().length != 0,
                "You must pass level 11"
            );
        } else if (id == 12) {
            // Check for HashCollision game
            HashCollision entity = HashCollision(_entity);
            require(entity.collisionFound(), "You must pass level 12");
        } else if (id == 13) {
            // Check for DecodeData game
            DecodeData entity = DecodeData(_entity);
            (, uint256 number) = entity.player();
            require(number == 1, "You must pass level 13");
        } else if (id == 14) {
            // Check for Factory game
            Factory entity = Factory(_entity);
            require(entity.correctPrediction(), "You must pass level 14");
        } else if (id == 15) {
            // Check for SupportInterface game
            SupportInterface entity = SupportInterface(_entity);
            require(entity.contractInterface(), "You must pass level 15");
        } else if (id == 16) {
            // Check for LimitedTickets game
            LimitedTickets entity = LimitedTickets(_entity);
            require(entity.Count(player) > 3, "You must pass level 16");
        } else if (id == 17) {
            // Check for EducatedGuess game
            EducatedGuess entity = EducatedGuess(_entity);
            require(entity.correctGuess(), "You must pass level 17");
        } else if (id == 18) {
            // Check for EducatedGuess game
            Unchecked entity = Unchecked(_entity);
            require(entity.correctCalc(), "You must pass level 18");
        }
        return true;
    }

    function getMaxGame() external pure returns (uint256) {
        return 18;
    }
}
