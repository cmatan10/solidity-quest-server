// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./interfaces/IHelper.sol";

contract NFTbadge is Initializable, ERC1155Upgradeable, OwnableUpgradeable {
    IHelper public helper;
    string public name;
    string public symbol;
    bool public paused;
    uint256 public totalGames;

    mapping(uint256 => string) public tokenURI;

    function initialize(address _helperAddress) external initializer {
        __ERC1155_init("");
        __Ownable_init(msg.sender);
        paused = false;
        name = "SolidityQuest";
        symbol = "QST";
        helper = IHelper(_helperAddress);
        totalGames = helper.getMaxGame();
    }

    modifier requirements(uint256 id) {
        require(!paused, "The contract is paused!");
        require(id != 0, "token doesn't exist");
        require(
            balanceOf(msg.sender, id) == 0,
            "You already own a token with this ID"
        );
        _;
    }

    function mint(uint16 id, address _entity) external requirements(id) {
        require(id > 0 && id <= totalGames, "Invalid game ID");
        require(
            helper.mintRequirements(id, _entity, msg.sender),
            "mint failed"
        );
        _mint(msg.sender, id, 1, "");
    }

    function finalMint() external {
        require(
            balanceOf(msg.sender, totalGames + 1000) < 1,
            "You have already minted the final NFT"
        );
        for (uint256 i = 1; i <= totalGames; i++) {
            require(
                balanceOf(msg.sender, i) > 0,
                "You need to own all the Token IDs to mint the final certificate"
            );
        }
        _mint(msg.sender, totalGames + 1000, 1, "");
    }

    function setBatchURI(
        uint256 start,
        uint256 end,
        string memory _uri
    ) external onlyOwner {
        uint256 count = end - start;
        for (uint256 i = 0; i < count; i++) {
            string memory fullURI = string(
                abi.encodePacked(_uri, "/", Strings.toString(start), ".json")
            );
            tokenURI[start] = fullURI;
            emit URI(fullURI, start);
            start++;
        }
    }

    function setURI(uint256 _id, string memory _uri) external onlyOwner {
        string memory fullURI = _uri;
        tokenURI[_id] = fullURI;
        emit URI(fullURI, _id);
    }

    function setFinalURI(string memory _uri) external onlyOwner {
        string memory fullURI = _uri;
        tokenURI[totalGames + 1000] = fullURI;
        emit URI(fullURI, totalGames + 1000);
    }

    function setPaused(bool _state) external onlyOwner {
        paused = _state;
    }

    function setHelperAddress(address _newHelperAddress) external onlyOwner {
        require(_newHelperAddress != address(0), "Invalid address");
        helper = IHelper(_newHelperAddress);
        totalGames = helper.getMaxGame();
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 value,
        bytes memory data
    ) public override {
        if (from != address(0) && to != address(0)) {
            revert(
                "NonTransferableERC1155: Transfers between non-zero addresses are not allowed"
            );
        }
        super._safeTransferFrom(from, to, id, value, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values,
        bytes memory data
    ) public override {
        if (from != address(0) && to != address(0)) {
            revert(
                "NonTransferableERC1155: Transfers between non-zero addresses are not allowed"
            );
        }
        super._safeBatchTransferFrom(from, to, ids, values, data);
    }
}
