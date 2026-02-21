import React from "react";
import { Upload, FileText } from "lucide-react";

const UploadRecordTab = ({
  selectedFile,
  fileName,
  setFileName,
  fileType,
  setFileType,
  fileTypes,
  handleFileChange,
  handleUploadSubmit,
  uploading,
}) => (
  <div className="max-w-3xl mx-auto">
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
          <Upload className="h-6 w-6 mr-2 text-emerald-400" />
          Upload Medical Record
        </h2>
        <p className="text-green-200">
          Securely upload your medical documents to the blockchain
        </p>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-green-100 mb-2">
            Upload Medical File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300/30 border-dashed rounded-lg hover:border-emerald-400/50 transition-colors">
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
                  className="relative cursor-pointer bg-emerald-600/20 rounded-md font-medium text-emerald-300 hover:text-white focus-within:outline-none px-3 py-1"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
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
            <div className="mt-3 p-3 bg-emerald-600/20 rounded-lg border border-emerald-400/30">
              <p className="text-sm text-white flex items-center">
                <FileText className="h-4 w-4 mr-2 text-emerald-400" />
                Selected:{" "}
                <span className="font-medium ml-1">{selectedFile.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* File Name */}
        <div>
          <label
            htmlFor="filename"
            className="block text-sm font-medium text-green-100 mb-2"
          >
            File Name
          </label>
          <input
            type="text"
            id="filename"
            value={fileName}
            placeholder="e.g. Annual Checkup 2024"
            onChange={(e) => setFileName(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-green-200/50"
            required
          />
        </div>

        {/* File Type */}
        <div>
          <label
            htmlFor="filetype"
            className="block text-sm font-medium text-green-100 mb-2"
          >
            Document Type
          </label>
          <select
            id="filetype"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            required
          >
            <option value="" disabled className="text-gray-500">
              Select document type
            </option>
            {fileTypes.map((type, index) => (
              <option
                key={index}
                value={type}
                className="text-gray-800 bg-white"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={uploading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
              uploading
                ? "bg-green-800 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300`}
          >
            {uploading ? (
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
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Medical Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default UploadRecordTab;