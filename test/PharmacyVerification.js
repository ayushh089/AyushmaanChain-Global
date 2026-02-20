const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PharmacyVerification", function () {
  let UserRegistry, userRegistry, PrescriptionRegistry, prescriptionRegistry, PharmacyVerification, pharmacyVerification;
  let deployer, patient, doctor, pharmacist, otherUser;

  before(async function () {
    [deployer, patient, doctor, pharmacist, otherUser] = await ethers.getSigners();

    // Deploy UserRegistry
    UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();

    // Register users
    await userRegistry.connect(patient).registerUser("patient");
    await userRegistry.connect(doctor).registerUser("doctor");

    // Deploy PrescriptionRegistry with UserRegistry's address
    PrescriptionRegistry = await ethers.getContractFactory("PrescriptionRegistry");
    prescriptionRegistry = await PrescriptionRegistry.deploy(await userRegistry.getAddress());
    await prescriptionRegistry.waitForDeployment();

    // Deploy PharmacyVerification with PrescriptionRegistry's address
    PharmacyVerification = await ethers.getContractFactory("PharmacyVerification");
    pharmacyVerification = await PharmacyVerification.deploy(await prescriptionRegistry.getAddress());
    await pharmacyVerification.waitForDeployment();

    // Doctor issues a prescription
    await prescriptionRegistry.connect(doctor).issuePrescription(patient.address, "QmHash123");
  });

  it("Should verify a prescription successfully", async function () {
    await expect(pharmacyVerification.connect(pharmacist).verifyPrescription(1))
      .to.emit(pharmacyVerification, "PrescriptionVerified")
      .withArgs(1, pharmacist.address);

    const isVerified = await pharmacyVerification.verifiedPrescriptions(1);
    expect(isVerified).to.equal(true);

    const prescription = await prescriptionRegistry.getPrescription(1);
    expect(prescription.fulfilled).to.equal(true);
  });

  it("Should not allow verifying an already verified prescription", async function () {
    await expect(pharmacyVerification.connect(pharmacist).verifyPrescription(1))
      .to.be.revertedWith("Prescription already verified");
  });

  it("Should prevent verifying an already fulfilled prescription", async function () {
    // Doctor issues another prescription
    await prescriptionRegistry.connect(doctor).issuePrescription(patient.address, "QmHash456");

    // Mark it as fulfilled manually (simulating real-world scenario)
    await prescriptionRegistry.connect(doctor).markPrescriptionFulfilled(2);

    await expect(pharmacyVerification.connect(pharmacist).verifyPrescription(2))
      .to.be.revertedWith("Prescription already fulfilled");
  });
});
