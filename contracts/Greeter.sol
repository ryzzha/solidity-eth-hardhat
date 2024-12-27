// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Greeter {
    string greet;

    function setGreet(string memory _greet) public {
        greet = _greet;
    }

    function getGreet() public view returns(string memory) {
        return greet;
    }
}