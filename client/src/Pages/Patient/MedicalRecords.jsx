import React, { useState } from "react";
import { zeroPadBytes } from "ethers";
import { pinata } from "../../config";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import { ToastContainer, toast } from "react-toastify";

const MedicalRecords = () => {
  const { contract, account } = useMedicalRecord();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [ipfsHash, setIpfsHash] = useState(null);
  const [shaHash, setShaHash] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  const fileTypes = [
    "Blood Test Report",
    "X-Ray Report",
    "MRI Scan Report",
    "CT Scan Report",
    "ECG Report",
    "Doctor's Prescription",
    "Surgery Report",
    "Vaccination Record",
    "Allergy Report",
    "Dental Report",
    "Eye Examination Report",
    "Medical History Report",
  ];

  const changeFileHandler = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const changeNameHandler = (e) => {
    setFileName(e.target.value);
  };

  async function computeSHA256(file) {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return [...new Uint8Array(hashBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !fileType || !fileName) {
      alert("Please select a file, enter a file name, and choose a file type.");
      return;
    }

    setLoading(true);
    try {
      const hash = await computeSHA256(selectedFile);
      const shaHashBytes32 = zeroPadBytes(`0x${hash}`, 32);
      setShaHash(shaHashBytes32);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", fileName);

      const response = await fetch(
        `${import.meta.env.VITE_BACKENDLINK}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();
      setIpfsHash(data.IpfsHash);

      if (!data.IpfsHash || !shaHashBytes32) {
        throw new Error("Missing IPFS hash or SHA256 hash.");
      }
      console.log(fileType);

      const tx = await contract.uploadRecord(
        fileName,
        fileType,
        data.IpfsHash,
        shaHashBytes32
      );
      await tx.wait();
      showSuccessToast("Medical record uploaded successfully");

      console.log("Medical record uploaded successfully");
    } catch (error) {
      console.error("Failed to upload medical record:", error);
      showErrorToast("Failed to upload medical record");
    } finally {
      setLoading(false);
    }
  };

  const getFile = async () => {
    const url = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
    setUrl(url);
  };

  const showSuccessToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
      <div className="container mx-auto py-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Medical Records</h1>
                <p className="text-green-200">Securely upload and manage your medical documents</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* File Upload */}
                  <div>
                    <label className="block text-sm font-medium text-green-100 mb-2">
                      Upload Medical File
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300/30 border-dashed rounded-lg">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-green-200"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-green-100">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-green-800/50 rounded-md font-medium text-green-200 hover:text-white focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              onChange={changeFileHandler}
                              required
                            />
                          </label>
                          <p className="pl-1 text-green-100">or drag and drop</p>
                        </div>
                        <p className="text-xs text-green-200/80">
                          PDF, JPG, PNG up to 10MB
                        </p>
                      </div>
                    </div>
                    {selectedFile && (
                      <p className="mt-2 text-sm text-green-100">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>

                  {/* File Name */}
                  <div>
                    <label htmlFor="filename" className="block text-sm font-medium text-green-100 mb-2">
                      File Name
                    </label>
                    <input
                      type="text"
                      id="filename"
                      value={fileName}
                      placeholder="e.g. Annual Checkup 2023"
                      onChange={changeNameHandler}
                      className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-green-200/50"
                      required
                    />
                  </div>

                  {/* File Type */}
                  <div>
                    <label htmlFor="filetype" className="block text-sm font-medium text-green-100 mb-2">
                      Document Type
                    </label>
                    <select
                      id="filetype"
                      value={fileType}
                      onChange={(e) => setFileType(e.target.value)}
                      className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-green-500 focus:border-transparent text-white"
                      required
                    >
                      <option value="" disabled className="text-gray-500">
                        Select document type
                      </option>
                      {fileTypes.map((type, index) => (
                        <option key={index} value={type} className="text-gray-800">
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
                        loading
                          ? "bg-green-800 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                    >
                      {loading ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
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
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Upload Medical Record"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default MedicalRecords;