// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./ILogger.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Receiver {
    ILogger logger;

    constructor(address _logger) {
        logger = ILogger(_logger);
    }
    
    receive() external payable {
        logger.log(msg.sender, msg.value);
    }

    function getPayment(address _from, uint _number) public view returns(uint) {
        return logger.getEntry(_from, _number);
    }
}