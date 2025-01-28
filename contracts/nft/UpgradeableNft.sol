// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract UpgradeableNFT is Initializable, ERC721Upgradeable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public nextTokenId;
    function initialize(string memory name, string memory symbol, address initialOwner) public initializer {
        __ERC721_init(name, symbol);
        __Ownable_init(initialOwner);
        __UUPSUpgradeable_init();
        nextTokenId = 1; 
    }

    function mint(address to) public onlyOwner {
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    function burn(uint256 tokenId) external {
        super._burn(tokenId);
    }

    function _authorizeUpgrade(address newImplementation) internal onlyOwner override {}

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        uint256 index = 0;

        for (uint256 tokenId = 1; tokenId < nextTokenId; tokenId++) {
            if (ownerOf(tokenId) == owner) {
                tokens[index] = tokenId;
                index++;
            }
        }
        return tokens;
    }
}
