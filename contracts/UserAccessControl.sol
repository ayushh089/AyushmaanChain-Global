// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract UserAccessControl is AccessControl {
    bytes32 public constant MANUFACTURE_ROLE = keccak256("Manufacturer");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("Distributor");
    bytes32 public constant PHARMACY_ROLE = keccak256("Pharmacy");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); 
    }

    function addManufacturer(
        address _manufacturer
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(MANUFACTURE_ROLE, _manufacturer);
    }

    function addDistributor(
        address _distributor
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DISTRIBUTOR_ROLE, _distributor);
    }

    function addPharmacy(
        address _pharmacy
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(PHARMACY_ROLE, _pharmacy);
    }

    function removeManufacturer(
        address _manufacturer
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(MANUFACTURE_ROLE, _manufacturer);
    }

    function removeDistributor(
        address _distributor
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(DISTRIBUTOR_ROLE, _distributor);
    }

    function removePharmacy(
        address _pharmacy
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(PHARMACY_ROLE, _pharmacy);
    }

    function isManufacturer(address _user) external view returns (bool) {
        return hasRole(MANUFACTURE_ROLE, _user);
    }

    function isDistributor(address _user) external view returns (bool) {
        return hasRole(DISTRIBUTOR_ROLE, _user);
    }

    function isPharmacy(address _user) external view returns (bool) {
        return hasRole(PHARMACY_ROLE, _user);
    }
}
