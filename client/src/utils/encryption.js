import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_AES_SECRETKEY; 

export const encryptPayload = (data) => {
  const payload = {
    ...data,
    hash: CryptoJS.SHA256(data.stripId + data.tokenId).toString()
  };
  return CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();
};

export const decryptPayload = (ciphertext) => {
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
    console.warn("Invalid or tampered QR payload");
    return null;
  }

};