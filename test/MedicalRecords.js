const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256, toUtf8Bytes } = require("ethers"); // Correct import

describe("MedicalRecords", function () {
  let UserRegistry, userRegistry;
  let MedicalRecords, medicalRecords;
  let owner, patient, doctor, otherUser;

  beforeEach(async function () {
    UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();

    MedicalRecords = await ethers.getContractFactory("MedicalRecords");
    medicalRecords = await MedicalRecords.deploy(await userRegistry.getAddress());
    await medicalRecords.waitForDeployment();

  
    [owner, patient, doctor, otherUser] = await ethers.getSigners();

    await userRegistry.connect(patient).registerUser("patient");
    await userRegistry.connect(doctor).registerUser("doctor");
    // await userRegistry.connect(otherUser).registerUser("hospital");
  });

  it("Should deploy the contracts correctly", async function () {
    expect(await userRegistry.isRegistered(patient.address)).to.be.true;
    expect(await userRegistry.isRegistered(doctor.address)).to.be.true;
  });

  it("Should allow a registered patient to upload a medical record", async function () {
    const ipfsHash = "QmTestHash12345";
    const sha256Hash = keccak256(toUtf8Bytes(ipfsHash)); 

    await expect(medicalRecords.connect(patient).uploadRecord(ipfsHash, sha256Hash))
      .to.emit(medicalRecords, "RecordUploaded")
      .withArgs(patient.address, ipfsHash, sha256Hash);
  });

  it("Should not allow non-patients to upload records", async function () {
    const ipfsHash = "QmInvalidTestHash";
    const sha256Hash = keccak256(toUtf8Bytes(ipfsHash));

    await expect(medicalRecords.connect(doctor).uploadRecord(ipfsHash, sha256Hash))
      .to.be.revertedWith("Only patients can upload records");

    await expect(medicalRecords.connect(otherUser).uploadRecord(ipfsHash, sha256Hash))
      .to.be.revertedWith("User not registered");
  });

  it("Should allow a patient to grant access to a doctor", async function () {
    await expect(medicalRecords.connect(patient).grantAccess(doctor.address))
      .to.emit(medicalRecords, "AccessGranted")
      .withArgs(patient.address, doctor.address);

    expect(await medicalRecords.accessPermissions(patient.address, doctor.address)).to.be.true;
  });

  it("Should not allow non-patients to grant access", async function () {
    await expect(medicalRecords.connect(doctor).grantAccess(patient.address))
      .to.be.revertedWith("Only patients can grant access");

    await expect(medicalRecords.connect(otherUser).grantAccess(doctor.address))
      .to.be.revertedWith("User not registered");
  });

  it("Should not allow granting access to a non-doctor", async function () {
    await userRegistry.connect(otherUser).registerUser("hospital");

    await expect(medicalRecords.connect(patient).grantAccess(otherUser.address))
      .to.be.revertedWith("Not a valid doctor");
  });

  it("Should allow a doctor to view patient records if access is granted", async function () {
    const ipfsHash = "QmTestHash12345";
    const sha256Hash = keccak256(toUtf8Bytes(ipfsHash));

    await medicalRecords.connect(patient).uploadRecord(ipfsHash, sha256Hash);
    await medicalRecords.connect(patient).grantAccess(doctor.address);

    const records = await medicalRecords.connect(doctor).getRecords(patient.address);
    expect(records.length).to.equal(1);
    expect(records[0].ipfsHash).to.equal(ipfsHash);
  });



  it("Should not allow revoked doctors to view patient records", async function () {
    const ipfsHash = "QmTestHash12345";
    const sha256Hash = keccak256(toUtf8Bytes(ipfsHash));

    await medicalRecords.connect(patient).uploadRecord(ipfsHash, sha256Hash);
    await medicalRecords.connect(patient).grantAccess(doctor.address);
    await medicalRecords.connect(patient).revokeAccess(doctor.address);

    await expect(medicalRecords.connect(doctor).getRecords(patient.address))
      .to.be.revertedWith("Access denied");
  });
});
