// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract Transfers {
    struct Transfer {
        uint amount;
        uint timestamp;
        address sender;
    }

    Transfer[] transfers;

    address owner;
    uint8 maxTransfers;
    uint8 currentTransfers;

    constructor(uint8 _maxTransfers) {
        console.log("msg.sender: %s", msg.sender);
        owner = msg.sender;
        maxTransfers = _maxTransfers;
    }

    function getTransfer(uint8 _index) public view returns(Transfer memory) {
        require(_index < transfers.length, "can not get this transfer");

        return transfers[_index];
    }

    modifier requireOwner() {
        require(owner == msg.sender, "you are not owner");
        _;
    }

    function withdrawTo(address payable _to) public requireOwner {
        _to.transfer(address(this).balance);
    }

    receive() external payable {
        if(currentTransfers >= maxTransfers) {
            revert("can not accept more transfers");
        }

        Transfer memory newTransfer = Transfer(msg.value, block.timestamp, msg.sender);
        transfers.push(newTransfer);
        currentTransfers++;
    }
}