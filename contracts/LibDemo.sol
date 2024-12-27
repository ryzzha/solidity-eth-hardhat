// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import "./Ext.sol";

contract LibDemo {
    using StrExt for string;
    using ArrExt for uint[];
    function runnerString(string memory str1, string memory str2) external pure returns(bool) {
        return StrExt.eq(str1, str2);
    }
    function runnerArray(uint[] memory numbers, uint el) external pure returns(bool) {
        return ArrExt.has(numbers, el);
    }
}