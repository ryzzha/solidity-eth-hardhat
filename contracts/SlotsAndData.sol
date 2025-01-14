// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SlotsAndData {
    uint256 a = 10;   // 0
    uint128 b = 20;   // 1
    uint128 c = 30;   // 1
    uint256[] nums;   // 2 length  main (length) kessak256(2) 0x...

    mapping(address => uint) addrs; // 3 length main (length) kessak256(k CONCAT 2) 0x...

    constructor() {
        nums.push(40);
        nums.push(50);
        addrs[address(this)] = 102;
    }

   
}