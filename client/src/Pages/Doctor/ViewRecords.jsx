import React, { useState, useEffect } from "react";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import { useAuth } from "../../context/AuthContext";
import useUserRegistry from "../../hooks/useUserRegistry";
import { ToastContainer, toast } from "react-toastify";

const ViewRecords = () => {
  const [records, setRecords] = useState([]);
  const [patientAddress, setPatientAddress] = useState("");
  const [viewType, setViewType] = useState("table");
  const { contract, account } = useMedicalRecord();
  const { contract: contractUser } = useUserRegistry();
  const { user } = useAuth();

  const fetchRecords = async () => {
    if (!contract || !contractUser || !patientAddress) return;
    try {
      console.log("Fetching records for:", patientAddress);
      try {
        const isRegistered = await contractUser.isRegistered(patientAddress);
        console.log("Is registered:", isRegistered);
      } catch {
        console.log("Patient not registered");
        toast.error("Patient not registered");
        return;
      }

      const result = await contract.getRecords(patientAddress);

      const formattedRecords = result.map((record) => ({
        fileName: record[0],
        fileType: record[1],
        ipfsHash: record[2],
        sha256Hash: record[3],
        uploadedBy: record[4],
        isShared: record[5],
      }));
      setRecords(formattedRecords);
    } catch (error) {
      if (error.reason) toast.error(error.reason);
      if (error.data) {
        console.error("Revert Reason:", error.reason);
        // console.error("Revert Reason:", error.data.message);
      }
      console.error("Error fetching records:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchRecords();
  };

  const groupedRecords = records.reduce((acc, record) => {
    acc[record.fileType] = acc[record.fileType] || [];
    acc[record.fileType].push(record);
    return acc;
  }, {});

  return (
    <div className="p-6 w-full max-w-3xl mx-auto">
      <form className="flex space-x-4 mb-4" onSubmit={handleSubmit}>
        <input
          type="text"
          value={patientAddress}
          onChange={(e) => setPatientAddress(e.target.value)}
          placeholder="Enter Patient Address"
          className="border p-2 rounded-md w-full"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-md"
        >
          Fetch Records
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">
        Hey {user?.name}, here are the records:
      </h1>

      <select
        onChange={(e) => setViewType(e.target.value)}
        className="mb-4 p-2 border rounded-md"
      >
        <option value="table">View as Table</option>
        <option value="type">Group by File Type</option>
      </select>

      {viewType === "table" ? (
        <TableView records={records} />
      ) : (
        <AccordionView groupedRecords={groupedRecords} />
      )}
      <ToastContainer />
    </div>
  );
};

const TableView = ({ records }) => (
  <table className="min-w-full border-collapse border border-gray-300">
    <thead>
      <tr className="bg-gray-100">
        <th className="border p-2">#</th>
        <th className="border p-2">File Name</th>
        <th className="border p-2">File Type</th>
        <th className="border p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      {records.map((record, index) => (
        <tr key={index} className="border">
          <td className="border p-2">{index + 1}</td>
          <td className="border p-2">{record.fileName}</td>
          <td className="border p-2">{record.fileType}</td>
          <td className="border p-2">
            <a
              href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View
            </a>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const AccordionView = ({ groupedRecords }) => (
  <div className="space-y-4">
    {Object.keys(groupedRecords).map((fileType, i) => (
      <details key={i} className="border p-2 rounded-lg bg-gray-100">
        <summary className="cursor-pointer font-semibold">{fileType}</summary>
        <ul className="list-disc ml-5">
          {groupedRecords[fileType].map((record, index) => (
            <li key={index} className="mt-2">
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                {record.fileName}
              </a>
            </li>
          ))}
        </ul>
      </details>
    ))}
  </div>
);

export default ViewRecords;
