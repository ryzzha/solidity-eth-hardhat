// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import "./IERC1155.sol";
import "./IERC1155MetadataURI.sol";
import "./IERC1155Receiver.sol";

contract ERC1155 is IERC1155, IERC1155MetadataURI { 
    mapping(uint => mapping(address => uint)) balances;
    mapping(address => mapping(address => bool)) approvals;
    string private uri;

    constructor(string memory _uri) {
        _setURI(_uri);
    }

    function getUri(uint) external view virtual returns(string memory) {
        return uri;
    }

    function _setURI(string memory newUri) internal virtual {
        uri = newUri;
    }

    function balanceOf(address account, uint id) public view returns(uint) {
        require(account != address(0), "zero address");
        return balances[id][account];
    } 

    function balanceOfBatch(address[] calldata accounts, uint[] calldata ids) external view returns(uint[] memory batchBalances) {
        require(accounts.length == ids.length, "");

        batchBalances = new uint[](accounts.length);

        for(uint i = 0; i < accounts.length; i++) {
            batchBalances[i] = balanceOf(accounts[i], ids[i]);
        }
    }

    function setApprovalForAll(address operator, bool approved) external {
        _setApprovalForAll(msg.sender, operator, approved);
    } 

    function isApprovedForAll(address account, address operator) public view returns(bool) {
        return approvals[account][operator];
    }
    
    function safeTransferFrom(address from, address to, uint id, uint amount, bytes calldata data) external {
        require(msg.sender == from || isApprovedForAll(from, msg.sender), "not allow");
        _safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(address from, address to, uint[] calldata ids, uint[] calldata amounts, bytes calldata data) external {
        require(msg.sender == from || isApprovedForAll(from, msg.sender), "not allow");
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function _safeTransferFrom(address from, address to, uint id, uint amount, bytes calldata data) public {
        require(to != address(0), "zero address");

        address operator = msg.sender;
        uint[] memory ids = _asSingletonArray(id);
        uint[] memory amounts = _asSingletonArray(amount);

        _beforeTokenTransfer(operator, from, to, ids, amounts, data);

        uint fromBalance = balanceOf(from, id);

        require(fromBalance >= amount, "low balance");

        balances[id][from] -= amount;
        balances[id][to] += amount;

        emit TransferSingle(operator, from, to, id, amount);

        _afterTokenTransfer(operator, from, to, ids, amounts, data);

        _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data);
    }

    function _safeBatchTransferFrom(address from, address to, uint[] calldata ids, uint[] calldata amounts, bytes calldata data) public {
        require(to != address(0), "zero address");
        require(ids.length == amounts.length, "");

        address operator = msg.sender;

        _beforeTokenTransfer(operator, from, to, ids, amounts, data);

        for(uint i = 0; i < ids.length; i++) {
            uint id = ids[i];
            uint amount = amounts[i];
            uint fromBalance = balanceOf(from,id);

            require(fromBalance >= amount, "low balance");

            balances[ids[i]][from] -= amount;
            balances[ids[i]][to] += amount;
        }

        emit TransferBatch(operator, from, to, ids, amounts);

        _afterTokenTransfer(operator, from, to, ids, amounts, data);

        _doSafeBatchTransferAcceptanceCheck(operator, from, to, ids, amounts, data);
    }

    function _setApprovalForAll(
        address owner,
        address operator,
        bool approved
    ) internal {
        require(owner != operator);
        approvals[owner][operator] = approved;
        emit ApprovalForAll(owner, operator, approved);
    }

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint[] memory ids,
        uint[] memory amounts,
        bytes memory data
    ) internal virtual {}
    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint[] memory ids,
        uint[] memory amounts,
        bytes memory data
    ) internal virtual {}

    function _doSafeTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint id,
        uint amount,
        bytes calldata data
    ) private {
        if(to.code.length > 0) {
            try IERC1155Receiver(to).onERC1155Received(operator, from, id, amount, data) returns(bytes4 resp) {
                if(resp != IERC1155Receiver.onERC1155Received.selector) {
                    revert("Rejected tokens!");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("Non-ERC1155 receiver!");
            }
        }
    }
    function _doSafeBatchTransferAcceptanceCheck(
        address operator,
        address from,
        address to,
        uint[] memory ids,
        uint[] memory amounts,
        bytes calldata data
    ) private {
        if(to.code.length > 0) {
            try IERC1155Receiver(to).onERC1155BatchReceived(operator, from, ids, amounts, data) returns(bytes4 resp) {
                if(resp != IERC1155Receiver.onERC1155BatchReceived.selector) {
                    revert("Rejected tokens!");
                }
            } catch Error(string memory reason) {
                revert(reason);
            } catch {
                revert("Non-ERC1155 receiver!");
            }
        }
    }
    function _asSingletonArray(uint el) private pure returns(uint[] memory result) {
        result = new uint[](1);
        result[0] = el;
    }
}