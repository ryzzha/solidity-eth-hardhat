// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface ILogger {
    function log(address _from, uint _amount) external;
    function getEntry(address _from, uint index) external view returns(uint);
}
