const jwt = require("jsonwebtoken");
const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");
const { config } = require("dotenv");
const ethers = require("ethers");

config();

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const loginHandler = async (req, res) => {
  const { walletAddress, signature, challengeMessage } = req.body;
  console.log("Login request:", { walletAddress, signature, challengeMessage });

  if (!walletAddress || !signature || !challengeMessage) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const recoveredAddress = ethers.verifyMessage(challengeMessage, signature);

    console.log("Wallet address:", walletAddress);
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ msg: "Invalid signature" });
    }
    console.log("Recovered address:", recoveredAddress);

    const user = await Client.query(
      "SELECT * FROM users WHERE wallet_address = $1",
      [walletAddress]
    );
console.log("User found:", user.rows);
    if (user.rowCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    const token = generateToken(user.rows[0].id);

    return res
      .status(200)
      .json({ msg: "Login successful", token, profile: user });
  } catch (err) {
    console.error("@loginHandler : \n", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { loginHandler };
