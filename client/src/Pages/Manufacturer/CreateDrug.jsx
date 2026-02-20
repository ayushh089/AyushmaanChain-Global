import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";
window.Buffer = Buffer;
import { useState } from "react";
import { ethers } from "ethers";
import { FlaskConical, Package, Calendar, Clock, FileText, Sparkles } from "lucide-react";

const { JsonRpcProvider } = ethers;

import useDrugNFT from "../../hooks/useDrugNFT";
import { uploadDrugMetadataToIPFS } from "../../utils/uploadBatchMetadata";
import { generateQRCodesAndDownload } from "../../utils/generateQRCodesAndDownload";

const CreateDrug = () => {
  const { contract, account } = useDrugNFT();
  const [loading, setLoading] = useState(false);
  const [ipfsLink, setIpfsLink] = useState(null);
  const [drugData, setDrugData] = useState({
    drugName: "",
    manfCode: "",
    productCode: "",
    batchDate: "",
    stripNo: "",
    manufactureDate: "",
    expiryDate: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDrugData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async () => {
    try {
      console.log("Uploading drug data to IPFS...");
      setLoading(true);

      const stripCount = parseInt(drugData.stripNo);
      const batchId = drugData.manfCode + Date.now().toString(16).slice(-6);
      const stripIDs = Array.from({ length: stripCount }, (_, i) => `${batchId}-${i + 1}`);
      const leaves = stripIDs.map((id) => keccak256(id));
      const merkleTree = new MerkleTree(leaves, keccak256, { sortPairs: true });
      const merkleRoot = merkleTree.getHexRoot();

      const metadata = {
        ...drugData,
        manufacturer: account,
        stripIDs,
        merkleRoot,
      };

      const ipfsUrl = await uploadDrugMetadataToIPFS(metadata, contract, account);
      setIpfsLink(ipfsUrl);

      const tx = await contract.mintBatch(batchId, merkleRoot, ipfsUrl);
      const receipt = await tx.wait();
      const event = receipt.logs
        .map(log => contract.interface.parseLog(log))
        .find(parsedLog => parsedLog.name === "BatchMinted");

      const tokenId = event?.args?.tokenId.toString();
      console.log("Batch minted successfully:", tokenId);
      toast.success(`${stripCount} Drug NFTs minted successfully!`);
      await generateQRCodesAndDownload(tokenId, stripIDs);

    } catch (error) {
      console.error("Error uploading drug data:", error.message);
      toast.error("Failed to create Drug NFTs: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { 
      label: "Drug Name", 
      name: "drugName", 
      icon: FlaskConical,
      placeholder: "Enter medication name"
    },
    { 
      label: "Manufacturer Code", 
      name: "manfCode", 
      icon: Package,
      placeholder: "Enter manufacturer code"
    },
    { 
      label: "Product Code", 
      name: "productCode", 
      icon: Package,
      placeholder: "Enter product code"
    },
    { 
      label: "Batch Date", 
      name: "batchDate", 
      icon: Calendar,
      placeholder: "YYYY-MM-DD"
    },
    { 
      label: "Strip Number", 
      name: "stripNo", 
      type: "number", 
      icon: Package,
      placeholder: "Enter number of strips"
    },
    { 
      label: "Manufacture Date", 
      name: "manufactureDate", 
      type: "date", 
      icon: Calendar,
      placeholder: ""
    },
    { 
      label: "Expiry Date", 
      name: "expiryDate", 
      type: "date", 
      icon: Clock,
      placeholder: ""
    },
  ];

  return (
    <div className="min-h-screen ">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30">
              <FlaskConical className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Create Drug NFT
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Mint secure, verifiable drug NFTs with blockchain-powered authenticity and traceability
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 p-8 space-y-8">
          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map(({ label, name, type = "text", icon: Icon, placeholder }) => (
              <div key={name} className="group">
                <label className="block text-sm font-semibold text-slate-200 mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-green-400" />
                    {label}
                  </div>
                </label>
                <div className="relative">
                  <input
                    type={type}
                    name={name}
                    value={drugData[name]}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-500"
                    placeholder={placeholder}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-focus-within:from-green-500/10 group-focus-within:to-emerald-500/10 pointer-events-none transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Description Field */}
          <div className="group">
            <label className="block text-sm font-semibold text-slate-200 mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-green-400" />
                Description
              </div>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={drugData.description}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-slate-500 resize-none"
                placeholder="Enter detailed drug description, usage instructions, and additional information..."
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 to-emerald-500/0 group-focus-within:from-green-500/10 group-focus-within:to-emerald-500/10 pointer-events-none transition-all duration-300"></div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              onClick={handleUpload}
              disabled={loading}
              className={`w-full py-4 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                loading
                  ? "bg-slate-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25"
              }`}
            >
              {loading ? (
                <span className="flex justify-center items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Minting Drug NFTs...</span>
                </span>
              ) : (
                <span className="flex justify-center items-center gap-3">
                  <Sparkles className="w-5 h-5" />
                  <span>Mint Drug NFT</span>
                </span>
              )}
            </button>
          </div>

          {/* Success Message */}
          {ipfsLink && (
            <div className="p-4 bg-green-500/20 border border-green-400/30 rounded-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">Successfully uploaded to IPFS!</span>
              </div>
              <a
                href={ipfsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-300 hover:text-green-200 underline transition-colors duration-200 text-sm mt-1 block"
              >
                View metadata on IPFS →
              </a>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Package className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-white font-semibold">Batch Creation</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Create multiple drug strips in a single batch with unique identifiers
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <FlaskConical className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-white font-semibold">NFT Minting</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Mint secure NFTs with Merkle tree verification for authenticity
            </p>
          </div>

          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-white font-semibold">QR Codes</h3>
            </div>
            <p className="text-slate-300 text-sm">
              Generate QR codes automatically for easy tracking and verification
            </p>
          </div>
        </div>
      </div>

      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default CreateDrug;