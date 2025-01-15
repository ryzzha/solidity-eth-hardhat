// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IAccessControl.sol";

abstract contract AccessControl is IAccessControl {
    struct RoleData {
        mapping(address => bool) members;
        bytes32 adminRole;
    }

    mapping(bytes32 => RoleData) private roles;

    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;

    modifier onlyRole(bytes32 role) {
        _checkRole(role);
        _;
    }

    function hasRole(bytes32 role, address account) public view returns(bool) {
        return roles[role].members[account];
    }

    function getRoleAdmin(bytes32 role) public view returns(bytes32) {
        return roles[role].adminRole;
    }

    function grantRole(bytes32 role, address account) external onlyRole(getRoleAdmin(role)) {
        _grantRole(role, account);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(getRoleAdmin(role)) {
        _revokeRole(role, account);
    }

    function renounceRole(bytes32 role, address account) external {
        require(msg.sender == account, "can only renounce for self");
        _revokeRole(role, account);
    }

    function _checkRole(bytes32 role) internal view virtual {
        _checkRole(role, msg.sender);
    }

    function _checkRole(bytes32 role, address account) internal view virtual {
        if(!hasRole(role, account)) {
            revert("no such role");
        }
    }

    function _setRoleAdmin(bytes32 role, bytes32 adminRole) internal {
        bytes32 previousAdminRole = getRoleAdmin(role);

        roles[role].adminRole = adminRole;

        emit RoleAdminChanged(role, previousAdminRole, adminRole);
    }

    function _grantRole(bytes32 role, address account) internal {
        if(!hasRole(role, account)) {
            roles[role].members[account] = true;
            emit RoleGranted(role, account, msg.sender);
        }
    }

    function _revokeRole(bytes32 role, address account) internal {
        if(hasRole(role, account)) {
            roles[role].members[account] = false;
            emit RoleRevoked(role, account, msg.sender);
        }
    }
} 