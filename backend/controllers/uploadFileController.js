require("dotenv").config();
const axios = require("axios");
const { log } = require("console");
const FormData = require("form-data");
const fs = require("fs");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

const uploadFileHandler = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(file.path));

        const pinataResponse = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    "pinata_api_key": process.env.PINATA_API_KEY,
                    "pinata_secret_api_key": process.env.PINATA_SECRET_API_KEY,
                    ...formData.getHeaders(),
                },
            }
        );
        console.log("Pinata response:", pinataResponse.data);

        res.json({ IpfsHash: pinataResponse.data.IpfsHash });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to upload file to IPFS" });
    }
};

module.exports = { uploadFileHandler, upload };
