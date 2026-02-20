const CryptoJS = require("crypto-js"); // Ensure you have crypto-js installed: npm install crypto-js
const { config } = require("dotenv");
const SECRET_KEY = process.env.VITE_AES_SECRETKEY; // 🔐 Replace with .env variable for production

const decryptPayload = (ciphertext) => {
    console.log("ciphertext", ciphertext);
    
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    const obj = JSON.parse(decrypted);

  
    const expectedHash = CryptoJS.SHA256(obj.stripId + obj.tokenId).toString();
    if (obj.hash !== expectedHash) {
      throw new Error("Tampered payload detected");
    }

    return obj;
  } catch (e) {
    return null;
  }
};
module.exports = {  decryptPayload };
