// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract SolidityQuestCoin is Initializable, ERC20Upgradeable, OwnableUpgradeable {
    address public signerAddress;
    uint256 public hintPrice;
    uint256 public solutionPrice;    
    mapping(address => uint256) public nonces;
    mapping(address =>  mapping(uint256 => bool)) public hints;
    mapping(address =>  mapping(uint256 => bool)) public solutions; 

    function initialize(address _signerAddress, uint256 _hintPrice, uint256 _solutionPrice) public initializer {
        __ERC20_init("SolidityQuestCoin", "SQC");
        __Ownable_init(msg.sender);
        _mint(address(this), 1000000000000 * 10 ** decimals()); 
        signerAddress = _signerAddress;
        hintPrice = _hintPrice;
        solutionPrice = _solutionPrice;
    }

    function claim(uint256 amount, uint256 nonce, bytes memory signature) external {
        require(nonce > nonces[msg.sender], "Invalid or reused nonce"); // Ensure nonce is valid

        bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, amount, nonce));
        
        bytes32 ethSignedMessageHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
        );

        address recoveredSigner = recoverSigner(ethSignedMessageHash, signature);
        require(recoveredSigner == signerAddress, "Invalid signature");

        nonces[msg.sender] = nonce;

        _transfer(address(this), msg.sender, amount);
    }

    function mint(uint256 amount) external onlyOwner{
        _mint(msg.sender, amount * 10 ** decimals()); 
    }

    function buyHint(address buyer, uint256 hintId) external {
        require(balanceOf(msg.sender) >= hintPrice, "Insufficient balance to buy hint");
        require(hints[buyer][hintId] == false, "Hint already purchased");

        _transfer(msg.sender, address(this), hintPrice);
        hints[buyer][hintId] = true;
    }

    function buySolution(address buyer, uint256 solutionId) external {
        require(balanceOf(msg.sender) >= solutionPrice, "Insufficient balance to buy solution");
        require(solutions[buyer][solutionId] == false, "Solution already purchased");

        _transfer(msg.sender, address(this), solutionPrice); 
        solutions[buyer][solutionId] = true; 
    }

    function setHintPrice(uint256 newHintPrice) public onlyOwner {
        hintPrice = newHintPrice;
    }

    function setSolutionPrice(uint256 newSolutionPrice) public onlyOwner {
        solutionPrice = newSolutionPrice;
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        return (r, s, v);
    }
}
