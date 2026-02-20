const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrescriptionNFT", function () {
    let PrescriptionNFT, nftContract, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        PrescriptionNFT = await ethers.getContractFactory("PrescriptionNFT");
        nftContract = await PrescriptionNFT.deploy();
        await nftContract.waitForDeployment();
    });

    it("should deploy successfully and set owner", async function () {
        expect(await nftContract.owner()).to.equal(owner.address);
    });

    it("should allow owner to mint a prescription NFT", async function () {
        const tokenURI = "ipfs://some-uri";
        await expect(nftContract.mintPrescription(addr1.address, tokenURI))
            .to.emit(nftContract, "Transfer")
            .withArgs(ethers.ZeroAddress, addr1.address, 1);

        expect(await nftContract.ownerOf(1)).to.equal(addr1.address);
    });

    it("should not allow non-owner to mint", async function () {
        const tokenURI = "ipfs://some-uri";
        await expect(
            nftContract.connect(addr1).mintPrescription(addr1.address, tokenURI)
        )
            .to.be.revertedWithCustomError(nftContract, "OwnableUnauthorizedAccount")
            .withArgs(addr1.address);
    });
});
