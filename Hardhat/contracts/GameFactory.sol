// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract GameFactory is Initializable, OwnableUpgradeable {
    bool public paused;
    mapping(uint256 => mapping(bool => bytes)) public Games;

    event DeployInstance(
        address indexed Instance,
        address indexed sender,
        uint256 indexed game
    );

    function initialize() external initializer {
        __Ownable_init(msg.sender);
        paused = false;
    }

    function deploy(
        uint256 game
    ) external returns (address addr, address hackAddr) {
        require(Games[game][false].length > 0, "Game data is empty");
        require(!paused, "The contract is paused!");
        bytes memory bytecode = Games[game][false];
        assembly {
            addr := create(callvalue(), add(bytecode, 0x20), mload(bytecode))
        }
        require(addr != address(0), "deploy failed");
        emit DeployInstance(addr, msg.sender, game);

        bytes memory hackBytecode = Games[game][true];
        if (hackBytecode.length > 0) {
            assembly {
                hackAddr := create(
                    callvalue(),
                    add(hackBytecode, 0x20),
                    mload(hackBytecode)
                )
            }
            require(hackAddr != address(0), "Hack deploy failed");
            emit DeployInstance(hackAddr, msg.sender, game);
        }
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function addGame(uint256 id, bool hackingGame, bytes memory _bytes) public {
        Games[id][hackingGame] = _bytes;
    }
    
    function getBytes(
        uint16 id,
        bool hackingGame
    ) public view returns (bytes memory) {
        return Games[id][hackingGame];
    }
}
