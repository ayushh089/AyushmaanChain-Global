const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with account: ${deployer.address}`);


  const UserRegistry = await hre.ethers.getContractFactory("UserRegistry");
  const userRegistry = await UserRegistry.deploy();
  await userRegistry.waitForDeployment();
  const userRegistryAddress = await userRegistry.getAddress();
  console.log(`=> UserRegistry deployed at: ${userRegistryAddress}`);


  const MedicalRecords = await hre.ethers.getContractFactory("MedicalRecords");
  const PrescriptionNFT = await hre.ethers.getContractFactory("PrescriptionNFT");
  const UserAcessControl = await hre.ethers.getContractFactory("UserAccessControl");
  const DrugNFT = await hre.ethers.getContractFactory("DrugNFT");
  
  const medicalRecords = await MedicalRecords.deploy(userRegistryAddress);
  const prescriptionNFT = await PrescriptionNFT.deploy(userRegistryAddress,deployer.address);
  const drugNFT = await DrugNFT.deploy(userRegistryAddress);
  const userAccessControl = await UserAcessControl.deploy();

  await Promise.all([
    medicalRecords.waitForDeployment(),
    prescriptionNFT.waitForDeployment(),
    userAccessControl.waitForDeployment(),
    drugNFT.waitForDeployment()
  ]);

  console.log(`=> MedicalRecords deployed at: ${await medicalRecords.getAddress()}`);
  console.log(`=> PrescriptionNFT deployed at: ${await prescriptionNFT.getAddress()}`);
  console.log(`=> UserAccessControl deployed at: ${await userAccessControl.getAddress()}`);
  console.log(`=> DrugNFT deployed at: ${await drugNFT.getAddress()}`);

  console.log("All contracts deployed successfully!");
}

main().catch((error) => {
  console.error("Error deploying contracts:", error);
  process.exitCode = 1;
});
