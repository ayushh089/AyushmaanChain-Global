const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistry", function () {
  let UserRegistry, userRegistry, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy();
    await userRegistry.waitForDeployment();
  });

  it("Should deploy the contract", async function () {
    expect(await userRegistry.getAddress()).to.be.properAddress;
  });

  it("Should register a new user", async function () {
    await expect(userRegistry.connect(addr1).registerUser("doctor"))
      .to.emit(userRegistry, "UserRegistered")
      .withArgs(addr1.address, "doctor");

    const registered = await userRegistry.isRegistered(addr1.address);
    expect(registered).to.equal(true);

    const userType = await userRegistry.getUserType(addr1.address);
    expect(userType).to.equal("doctor");
  });

  it("Should revert if user already registered", async function () {
    await userRegistry.connect(addr1).registerUser("patient");
    await expect(
      userRegistry.connect(addr1).registerUser("doctor")
    ).to.be.revertedWith("User already registered");
  });

  it("Should reject invalid user types", async function () {
    await expect(
      userRegistry.connect(addr1).registerUser("nurse")
    ).to.be.revertedWith("Invalid user type");
  });

  it("Should return correct registration status", async function () {
    expect(await userRegistry.isRegistered(addr2.address)).to.equal(false);

    await userRegistry.connect(addr1).registerUser("hospital");
    expect(await userRegistry.isRegistered(addr1.address)).to.equal(true);
  });

  it("Should return correct user type", async function () {
    await userRegistry.connect(addr1).registerUser("patient");
    const userType = await userRegistry.getUserType(addr1.address);
    expect(userType).to.equal("patient");
  });

  it("Should correctly identify doctors", async function () {
    await userRegistry.connect(addr1).registerUser("doctor");
    expect(await userRegistry.isDoctor(addr1.address)).to.equal(true);
    expect(await userRegistry.isDoctor(addr2.address)).to.equal(false); 
  });

  it("Should return false for non-doctor users", async function () {
    await userRegistry.connect(addr1).registerUser("patient");
    expect(await userRegistry.isDoctor(addr1.address)).to.equal(false);
  });
});
