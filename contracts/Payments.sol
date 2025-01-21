// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

contract Payments {
    address owner;

    mapping(uint => bool) nonces;

    constructor() payable {
        require(msg.value > 1, "need some value");
        owner = msg.sender;
    }

    function claim(uint amount, uint nonce, bytes memory signature) external {
        require(!nonces[nonce], "already claim");

        nonces[nonce] = true;

        bytes32 message = withPrefix(keccak256(abi.encodePacked(msg.sender, amount, nonce, address(this))));

        require(recoverSigner(message, signature) == owner, "wrong sign:(");

        payable(msg.sender).transfer(amount);
    }

    function recoverSigner(bytes32 message, bytes memory signature) internal pure returns(address) {
        (uint8 v, bytes32 r, bytes32 s) = splitSignature(signature);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(bytes memory signature) internal pure returns(uint8 v, bytes32 r, bytes32 s) {
        require(signature.length == 65, "sign length must be 65");

        assembly {
            r := mload(add(signature, 32))

            s := mload(add(signature, 64))

            v := byte(0, mload(add(signature, 96)))
        }

        return (v, r, s);
    }
    function withPrefix(bytes32 hash) internal pure returns(bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }
}