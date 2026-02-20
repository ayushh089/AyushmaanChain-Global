const jwt = require("jsonwebtoken");
const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");
const { config } = require("dotenv");
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
const { default: axios } = require("axios");

config();

const fetchProofController = async (req, res) => {
  const { ipfsURL,stripID } = req.body;
  const modifiedIpfsURL = ipfsURL.replace(
    "https://ipfs.io/ipfs/",
    process.env.VITE_PINATA_LINK
  );
  console.log("ipfsURL", modifiedIpfsURL);
  console.log("stripID", stripID);

  try {
    const response = await axios.get(modifiedIpfsURL);
    console.log("Response:", response.data);

    const { stripIDs, merkleRoot,manufactureDate,expiryDate,drugName,manfCode,description } = response.data;

    console.log("StripIds", stripIDs);

    const leaves = stripIDs.map((id) => keccak256(id));
    const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const root = tree.getHexRoot();

    if (root !== merkleRoot) {
      res.status(500).json({ error: "IPFS DATA HAVE BEEN TAMPERED" });
      return;
    }

    const leaf = keccak256(stripID);
    const proof = tree.getHexProof(leaf);
    console.log("proof", proof);
    res.json({ proof,manufactureDate,expiryDate,drugName,manfCode,description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not generate Merkle proof." });
  }
};

module.exports = { fetchProofController };
