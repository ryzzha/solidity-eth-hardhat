// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./ERC4907.sol";

contract ERC4907Demo is ERC4907 {
    constructor(string memory name, string memory symbol) ERC4907(name, symbol) { }

    function mint(address to, uint tokenId) public {
        _mint(to, tokenId);
    }
}