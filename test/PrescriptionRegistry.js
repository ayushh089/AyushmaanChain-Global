const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("PrescriptionRegistry", function () {
    let UserRegistry, userRegistry, PrescriptionRegistry, prescriptionRegistry;
    let patient, doctor, otherUser;
  
    before(async function () {
      [deployer, patient, doctor, otherUser] = await ethers.getSigners();
  
      UserRegistry = await ethers.getContractFactory("UserRegistry");
      userRegistry = await UserRegistry.deploy();
      await userRegistry.waitForDeployment(); 
  
      await userRegistry.connect(patient).registerUser("patient");
      await userRegistry.connect(doctor).registerUser("doctor");
  
      PrescriptionRegistry = await ethers.getContractFactory("PrescriptionRegistry");
      prescriptionRegistry = await PrescriptionRegistry.deploy(await userRegistry.getAddress());
      await prescriptionRegistry.waitForDeployment(); 
    });
  
    it("Should allow a doctor to issue a prescription", async function () {
      await expect(
        prescriptionRegistry.connect(doctor).issuePrescription(patient.address, "QmHash123")
      ).to.emit(prescriptionRegistry, "PrescriptionIssued");
  
      const prescription = await prescriptionRegistry.getPrescription(1);
      expect(prescription.ipfsHash).to.equal("QmHash123");
      expect(prescription.patient).to.equal(patient.address);
      expect(prescription.doctor).to.equal(doctor.address);
    });
  
    it("Should prevent non-doctors from issuing prescriptions", async function () {
      await expect(
        prescriptionRegistry.connect(patient).issuePrescription(patient.address, "QmHash456")
      ).to.be.revertedWith("Only doctors can issue prescriptions");
    });
  
    it("Should allow a patient to fetch their prescriptions", async function () {
      const prescriptions = await prescriptionRegistry.getPatientPrescriptions(patient.address);
      expect(prescriptions.length).to.equal(1);
      expect(prescriptions[0].ipfsHash).to.equal("QmHash123");
    });
  
    it("Should allow marking a prescription as fulfilled", async function () {
      await prescriptionRegistry.connect(doctor).markPrescriptionFulfilled(1);
      const prescription = await prescriptionRegistry.getPrescription(1);
      expect(prescription.fulfilled).to.equal(true);
    });
  
    it("Should not allow fulfilling an already fulfilled prescription", async function () {
      await expect(prescriptionRegistry.connect(doctor).markPrescriptionFulfilled(1))
        .to.be.revertedWith("Prescription already fulfilled");
    });
  });
  
