// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

library StrExt {
    function eq(string memory str1, string memory str2) internal pure returns(bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
    }
}

library ArrExt {
    function has(uint[] memory numbers, uint el) internal pure returns(bool) {
        for(uint i = 0; i < numbers.length; i++) {
            if(numbers[i] == el) {
                return true;
            }
        }
        return false;
    }
}