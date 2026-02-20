// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "./UserAccessControl.sol";

contract DrugNFT is ERC721URIStorage {
    using ECDSA for bytes32;

    UserAccessControl public userAccessControl;

    constructor(address _userAccessControl) ERC721("DrugNFT", "DRUG") {
        userAccessControl = UserAccessControl(_userAccessControl);
    }

    struct Batch {
        bytes32 merkleRoot;
        string metadataURI;
        address manufacturer;
        uint256 timestamp;
    }

    mapping(uint256 => Batch) public batches;
    mapping(uint256 => bool) public isBatchMinted;
    mapping(string => bool) public usedStrip;

    event StripVerified(
        uint256 tokenId,
        string stripId,
        address verifier,
        uint256 timestamp
    );

    event BatchMinted(
        uint256 tokenId,
        string batchId,
        bytes32 merkleRoot,
        string metadataURI,
        address manufacturer
    );

    function mintBatch(
        string memory batchId,
        bytes32 merkleRoot,
        string memory metadataURI
    ) public returns (uint256) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(batchId)));
        require(!isBatchMinted[tokenId], "Batch already exists");

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, metadataURI);

        batches[tokenId] = Batch({
            merkleRoot: merkleRoot,
            metadataURI: metadataURI,
            manufacturer: msg.sender,
            timestamp: block.timestamp
        });
        isBatchMinted[tokenId] = true;

        emit BatchMinted(tokenId, batchId, merkleRoot, metadataURI, msg.sender);
        return tokenId;
    }

    function getBatch(uint256 tokenId) public view returns (Batch memory) {
        require(isBatchMinted[tokenId], "Batch does not exist");
        return batches[tokenId];
    }

    function isBatchExists(string memory batchId) public view returns (bool) {
        uint256 tokenId = uint256(keccak256(abi.encodePacked(batchId)));
        return isBatchMinted[tokenId];
    }

    function getBatchId(uint256 tokenId) public view returns (string memory) {
        require(isBatchMinted[tokenId], "Batch does not exist");
        return
            string(abi.encodePacked("Batch ID: ", Strings.toString(tokenId)));
    }

    function verifyStrip(
        uint256 tokenId,
        string memory stripID,
        bytes32[] calldata proof
    ) external  returns (bool) {
        require(isBatchMinted[tokenId], "Batch not found");
        require(!usedStrip[stripID], "Strip already verified");
        Batch memory batch = batches[tokenId];
        bytes32 leaf = keccak256(abi.encodePacked(stripID));
        bool isValidProof = MerkleProof.verify(proof, batch.merkleRoot, leaf);
        usedStrip[stripID] = true;
        require(isValidProof, "Invalid Merkle Proof");
        emit StripVerified(tokenId, stripID, msg.sender, block.timestamp);
        return true;
    }
}
