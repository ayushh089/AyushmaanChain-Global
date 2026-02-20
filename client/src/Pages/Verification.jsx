import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import usePrescriptionNFT from "../hooks/usePrescriptionNFT";
import axios from "axios";

const Verification = () => {
  const [searchParams] = useSearchParams();
  const tokenId = searchParams.get("tokenid");
  console.log("Token ID:", tokenId);

  const { contract, account } = usePrescriptionNFT();
  const [isRevoked, setIsRevoked] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isFulfilled, setIsFulfilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [doctorName, setDoctorName] = useState(null);
  const [patientName, setPatientName] = useState(null);

  useEffect(() => {
    if (!contract || !tokenId) return;
    console.log("Fetching prescription details for Token ID:", tokenId);
    

    const fetchDetails = async () => {
      try {
        const filter = contract.filters.PrescriptionMinted(null, null, tokenId);
        const events = await contract.queryFilter(filter);

        if (events.length > 0) {
          const { args } = events[0]; // Extract event parameters
          setDoctor(args.doctor);
          setPatient(args.patient);
          console.log("Doctor:", args.doctor);
          console.log("Patient:", args.patient);
        } else {
          console.log("No event found for Token ID:", tokenId);
        }
      } catch (error) {
        console.error("Error fetching prescription details:", error);
      }
    };

    fetchDetails();
  }, [tokenId,contract]);

  useEffect(() => {
    if (!contract || !account) return;

    const fetchNFTDetails = async () => {
      try {
        const txRevoked = await contract.isRevoked(tokenId);
        const txVerified = await contract.isVerified(tokenId);
        const txExpired = await contract.isExpired(tokenId);
        const txFulfilled = await contract.isFulfilled(tokenId);

        setIsRevoked(txRevoked);
        setIsVerified(txVerified);
        setIsExpired(txExpired);
        setIsFulfilled(txFulfilled);
      } catch (error) {
        console.error("Error fetching NFT details:", error);
        alert("Failed to load NFT details.");
      } finally {
        setLoading(false);
      }
    };
    fetchNFTDetails();
  }, [tokenId, contract, account]);

  const openPrescription = async () => {
    try {
      const uri = await contract.tokenURI(tokenId);
      console.log("Prescription URI:", uri);
      window.open(uri, "_blank");
    } catch (error) {
      console.error("Error fetching prescription:", error);
      alert("Failed to open prescription.");
    }
  };

  const markFulfilled = async () => {
    if (!contract || !account) return;
    try {
      const txFulfilled = await contract.fulfillPrescription(tokenId);
      await txFulfilled.wait();
      setIsFulfilled(true);
      alert("Prescription marked as fulfilled!");
    } catch (error) {
      console.error("Error marking prescription as fulfilled:", error);
      alert("Failed to mark prescription as fulfilled.");
    }
  };

  useEffect(() => {
    const fetchDoctorName = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDLINK}/fetchData`,
        { walletAddress: doctor }
      );
      console.log(response.data.name);
      setDoctorName(response.data.name);
    };
    const fetchPatientName = async () => {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDLINK}/fetchData`,
        { walletAddress: patient }
      );
      console.log(response.data.name);
      setPatientName(response.data.name);
    };
    fetchDoctorName();
    fetchPatientName();
  }, [doctor,patient]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Prescription Verification
        </h2>

        <div className="border-b pb-4 mb-4">

          <p className="text-lg">
            <strong>Doctor:</strong> {doctorName} - <i>{doctor}</i>
          </p>
          <p className="text-lg">
            <strong>Patient:</strong> {patientName} - <i>{patient}</i>
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <>
            <div className="space-y-3 text-lg">
              <div className="flex justify-between items-center">
                <strong>Status:</strong>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isRevoked
                      ? "bg-red-100 text-red-600"
                      : isExpired
                      ? "bg-yellow-100 text-yellow-600"
                      : isVerified
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {isRevoked
                    ? "Revoked ❌"
                    : isExpired
                    ? "Expired ⚠️"
                    : isVerified
                    ? "Verified ✅"
                    : "Not Verified"}
                </span>
              </div>

              {isVerified && !isRevoked && !isExpired ? (
                <p className="text-green-600 text-center">
                  ✅ This prescription is valid.
                </p>
              ) : (
                <p className="text-red-600 text-center">
                  ⚠️ This prescription is NOT valid.
                </p>
              )}

              {isFulfilled && (
                <p className="text-blue-600 text-center">
                  ✅ Already Dispensed
                </p>
              )}
            </div>

            {isVerified && !isRevoked && !isExpired && !isFulfilled && (
              <div className="mt-6 space-y-3">
                <button
                  onClick={openPrescription}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  View Prescription
                </button>
                <button
                  onClick={markFulfilled}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Mark as Dispensed
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Verification;
