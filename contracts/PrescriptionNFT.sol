// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IUserRegistry {
    function isDoctor(address _user) external view returns (bool);
    function isPharmacist(address _user) external view returns (bool);
}

contract PrescriptionNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    IUserRegistry public userRegistry;

    mapping(uint256 => uint256) public expiryTimestamps;
    mapping(uint256 => bool) public revoked;
    mapping(uint256 => bool) private mintedTokens;
    mapping(uint256 => bool) private fulfilled;

    event PrescriptionMinted(
        address indexed doctor,
        address indexed patient,
        uint256 indexed tokenId
    );
    event PrescriptionRevoked(uint256 tokenId);

    constructor(
        address _userRegistry,
        address _owner
    ) ERC721("PrescriptionNFT", "PRESC") Ownable(_owner) {
        userRegistry = IUserRegistry(_userRegistry);
    }

    function mintPrescription(
        address to,
        string memory tokenURI,
        uint256 expiryTime
    ) public returns (uint256) {
        require(
            userRegistry.isDoctor(msg.sender),
            "Only doctors can mint prescriptions"
        );

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;

        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        expiryTimestamps[newTokenId] = block.timestamp + expiryTime;
        revoked[newTokenId] = false;
        mintedTokens[newTokenId] = true;
        fulfilled[newTokenId] = false;

        emit PrescriptionMinted(msg.sender, to, newTokenId);
        return newTokenId;
    }

    function fulfillPrescription(uint256 tokenId) public {
        require(
            userRegistry.isPharmacist(msg.sender),
            "Only Pharmacy can fulfill prescriptions"
        );
        require(!fulfilled[tokenId], "Prescription already fulfilled");
        require(!revoked[tokenId], "Prescription is revoked");

        fulfilled[tokenId] = true;
    }
    function isFulfilled(uint256 tokenId) public view returns (bool) {
        return fulfilled[tokenId];
    }

    function isExpired(uint tokenId) public view returns (bool) {
        return block.timestamp > expiryTimestamps[tokenId];
    }

    function isRevoked(uint tokenId) public view returns (bool) {
        return revoked[tokenId];
    }

    function isVerified(uint256 tokenId) public view returns (bool) {
        return mintedTokens[tokenId];
    }

    function revokePrescription(uint256 tokenId) public {
        require(
            userRegistry.isDoctor(msg.sender),
            "Only doctors can revoke prescriptions"
        );
        require(!revoked[tokenId], "Prescription already revoked");

        revoked[tokenId] = true;
        emit PrescriptionRevoked(tokenId);
    }

    function isApprovedOrOwner(
        address spender,
        uint256 tokenId
    ) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner ||
            getApproved(tokenId) == spender ||
            isApprovedForAll(owner, spender));
    }

    function burn(uint256 tokenId) public {
        require(
            isApprovedOrOwner(msg.sender, tokenId),
            "Not authorized to burn"
        );
        _burn(tokenId);
         mintedTokens[tokenId] = false;
    }
}
