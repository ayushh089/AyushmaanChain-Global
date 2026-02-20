import React, { useState } from "react";
import axios from "axios";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import useDrugNFT from "../../hooks/useDrugNFT";
import { decryptPayload } from "../../utils/encryption";

const VerifyDrug = () => {
  // const [batchId, setBatchId] = useState("");
  const { contract } = useDrugNFT();
  const [stripID, setStripID] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult("");
    try {
      const decrypted = decryptPayload(stripID);
      if (!decrypted || !decrypted.stripId || !decrypted.tokenId) {
        setResult("❌ Invalid or tampered QR code");
        return;
      }

      const { tokenId, stripId } = decrypted;
      console.log("Decrypted Data:", decrypted);
      console.log("Token ID:", tokenId);
      console.log("Strip ID:", stripId);

      const batch = await contract.getBatch(tokenId);
      console.log("Batch:", batch[1]);

      const ipfsURL = batch[1];

      const response = await axios.get(ipfsURL);
      console.log("Response:", response.data);

      const { stripIDs } = response.data;
      console.log("StripIds", stripIDs);

      const leaves = stripIDs.map((id) => keccak256(id));
      const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });

      const leaf = keccak256(stripId);
      const proof = tree.getHexProof(leaf);
      console.log("prrof", proof);

      const isValid = await contract.verifyStrip(tokenId, stripId, proof);
      setResult(isValid ? "Valid Strip! Genuine." : "Invalid Strip!");
    } catch (err) {
      console.error(err);
      setResult("Verification Failed! Check ID or Network.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-lg border mt-12 space-y-6 transition-all duration-300">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Verify Drug Strip
      </h2>

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            {/* <label className="mb-1 text-gray-700 font-medium">Batch ID</label>
            <input
              type="text"
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Batch ID"
              required
            /> */}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-gray-700 font-medium">Strip ID</label>
            <input
              type="text"
              value={stripID}
              onChange={(e) => setStripID(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter Strip ID"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition duration-300 ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? (
            <span className="flex justify-center items-center gap-2">
              <svg
                className="w-5 h-5 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Verifying...
            </span>
          ) : (
            "Verify Drug Strip"
          )}
        </button>
      </form>

      {result && (
        <div
          className={`text-center text-lg font-medium mt-4 ${
            result.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
};

export default VerifyDrug;
