"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import signature from "../../assets/signature.png"; // Import signature image
import axios from "axios"; // Import axios
import useMedicalRecord from "../../hooks/useMedicalRecord";
import usePrescriptionNFT from "../../hooks/usePrescriptionNFT";
import { uploadToIPFS } from "../../utils/UploadToIPFS";
import { useAuth } from "../../context/AuthContext";

const AddPrescription = () => {
  const { contract, address } = useMedicalRecord();
  const { user, setUser } = useAuth();
  const { contract: contractNFT, address: addressNFT } = usePrescriptionNFT();
  const [loading, setLoading] = useState(false);
  const [prescription, setPrescription] = useState({
    patientId: "",
    patientName: "",
    doctorId: user?.wallet_address || "",
    doctorName: user?.name || "",
    timestamp: Date.now(),
    medicines: [{ name: "", dosage: "", frequency: "", duration: "" }],
    signature: "d58f3b4e2e9a...",
    signatureImage: signature,
  });

  const [ipfsLink, setIpfsLink] = useState(null);

  const handleChange = (e, index, field) => {
    if (index !== undefined) {
      const newMedicines = [...prescription.medicines];
      newMedicines[index][field] = e.target.value;
      setPrescription({ ...prescription, medicines: newMedicines });
    } else {
      setPrescription({ ...prescription, [e.target.name]: e.target.value });
    }
  };
  useEffect(() => {
    const fetchPatientName = async () => {
      if (!prescription.patientId) return;

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKENDLINK}/fetchData`,
          { walletAddress: prescription.patientId }
        );
        console.log(response.data.name);
        setPrescription((prev) => ({
          ...prev,
          patientName: response.data.name,
        }));
      } catch (error) {
        console.error("Error fetching patient name:", error);
      }
    };

    fetchPatientName();
  }, [prescription.patientId]);

  const addMedicine = () => {
    setPrescription({
      ...prescription,
      medicines: [
        ...prescription.medicines,
        { name: "", dosage: "", frequency: "", duration: "" },
      ],
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = prescription.medicines.filter((_, i) => i !== index);
    setPrescription({ ...prescription, medicines: newMedicines });
  };

  const handleUpload = async () => {
    try {
      setLoading(true);
      const ipfsUrl = await uploadToIPFS(prescription, contract, address);
      console.log("Prescription URI:", ipfsUrl);

      setIpfsLink(ipfsUrl);

      console.log("Prescription URI:", ipfsUrl);
      console.log("Patient ID:", prescription.patientId);
      console.log("Doctor ID:", prescription.doctorId);

      try {
        console.log("Minting NFT with Prescription...", ipfsUrl);

        const tx = await contractNFT.mintPrescription(
          prescription.patientId,
          ipfsUrl,
          20000000
        );
        await tx.wait();
        console.log("Prescription NFT uploaded successfully");
        console.log("NFT Minted with Prescription!");
      } catch (error) {
        console.error("NFT Minting error:", error);
        toast.error("Failed to mint NFT: " + error.message);
      }

      toast.success("Prescription uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload prescription: " + error.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetch = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDLINK}/fetchData`,
        { walletAddress: prescription.doctorId }
      );
      console.log(response.data.name);
    };
    fetch();
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md border mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Add Prescription
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-600 font-medium">Patient ID</label>
          <input
            type="text"
            name="patientId"
            value={prescription.patientId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Patient ID"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">
            Patient Name
          </label>
          <input
            type="text"
            name="patientId"
            value={prescription.patientName}
            // onChange={fetchPName}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Patient Name"
          />
        </div>

        {/* <div>
          <label className="block text-gray-600 font-medium">Doctor ID</label>
          <input
            type="text"
            name="doctorId"
            value={prescription.doctorId}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Doctor ID"
          />
        </div>
        <div>
          <label className="block text-gray-600 font-medium">Doctor Name</label>
          <input
            type="text"
            name="doctorId"
            value={prescription.doctorName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Doctor ID"
          />
        </div> */}
      </div>

      <h3 className="text-lg font-semibold mt-6 mb-2">Medicines</h3>
      {prescription.medicines.map((med, index) => (
        <div key={index} className="p-4 border rounded-lg mb-4 shadow-sm">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Drug Name"
              value={med.name}
              onChange={(e) => handleChange(e, index, "name")}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Dosage"
              value={med.dosage}
              onChange={(e) => handleChange(e, index, "dosage")}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Frequency"
              value={med.frequency}
              onChange={(e) => handleChange(e, index, "frequency")}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Duration"
              value={med.duration}
              onChange={(e) => handleChange(e, index, "duration")}
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {index > 0 && (
            <button
              onClick={() => removeMedicine(index)}
              className="mt-2 px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addMedicine}
        className="mt-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
      >
        + Add Medicine
      </button>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`w-full px-4 py-2 mt-6 bg-blue-600 text-white font-semibold rounded-lg transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>

      {ipfsLink && (
        <p className="text-center mt-4 text-green-600">
          Uploaded!{" "}
          <a
            href={ipfsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on IPFS
          </a>
        </p>
      )}
    </div>
  );
};

export default AddPrescription;
