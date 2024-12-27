// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Demo { 
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    event Paid(address indexed _from, uint _amount, uint _timestamp);


    receive() external payable {
        pay();
    }

    function pay() public payable {
        emit Paid(msg.sender, msg.value, block.timestamp);
    }

    modifier onlyOwner(address _to) {
        require(msg.sender == owner, "you are not a owner");
        require(_to != address(0), "you are not withdraw to null address");
        _;
    }

    function withdraw(address  _to) external onlyOwner(_to) {
        address payable  to = payable(_to);
        to.transfer(address(this).balance);
    }
}