const jwt = require("jsonwebtoken");
const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");
const { config } = require("dotenv");
const ethers = require("ethers");

config();

const fetchRecordController = async (req, res) => {
  console.log("hey there from fetchRecordController");
  
  const { walletAddress } = req.body;
  if (!walletAddress) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    // Check if the wallet address exists in the database
    const user = await Client.query(
      "SELECT * FROM users WHERE wallet_address = $1",
      [walletAddress]
    );

    if (user.rowCount === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({ name: user.rows[0].name,gmail:user.rows[0].email,phone:user.rows[0].phone });
  } catch (err) {
    console.error("@fetchRecordController : \n", err);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { fetchRecordController };
