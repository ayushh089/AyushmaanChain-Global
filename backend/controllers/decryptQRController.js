const jwt = require("jsonwebtoken");
const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");
const { config } = require("dotenv");
const { decryptPayload } = require("../utils/encryption.js");

config();

const decryptQRController = async (req, res) => {
  const { qrData } = req.body;

  try {
    const decrypted = decryptPayload(qrData); // Use input QR string
    if (!decrypted || !decrypted.stripId || !decrypted.tokenId) {
      res.status(400).json({ error: "❌ Invalid or tampered QR code" });
      return;
    }
    const { tokenId, stripId } = decrypted;
    console.log("Decrypted Data:", decrypted);

    res.json({ tokenId, stripId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate Merkle proof." });
  }
};

module.exports = { decryptQRController };
