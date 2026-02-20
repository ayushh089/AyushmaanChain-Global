require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      chainId: 31337,
      loggingEnabled: true,
      saveDeployments: true, // Persist deployments
    },
    // localhost: {
    //   url: "http://localhost:7545", // Custom port
    //   chainId: 1337,
    // },
  },
};
