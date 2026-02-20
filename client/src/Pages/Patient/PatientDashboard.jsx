import React, { useState, useEffect } from "react";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import { useAuth } from "../../context/AuthContext";
import useUserRegistry from "../../hooks/useUserRegistry";

const PatientDashboard = () => {
  const [records, setRecords] = useState([]);
  const [viewType, setViewType] = useState("table");
  const { contract, account } = useMedicalRecord();
  const { contract: contractUser, account: accountUser } = useUserRegistry();
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecords = async () => {
      if (contract && contractUser) {
        const isRegistered = await contractUser.isRegistered(accountUser);
        const result = await contract.getRecords(account);
        const formattedRecords = result.map((record) => ({
          fileName: record[0],
          fileType: record[1],
          ipfsHash: record[2],
          sha256Hash: record[3],
          uploadedBy: record[4],
          isShared: record[5],
        }));
        setRecords(formattedRecords);
      }
    };
    fetchRecords();
  }, [contract, account, accountUser, contractUser]);

  const groupedRecords = records.reduce((acc, record) => {
    acc[record.fileType] = acc[record.fileType] || [];
    acc[record.fileType].push(record);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
      <div className="container mx-auto py-8">
        <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20 p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, <span className="text-emerald-300">{user.name}</span>
            </h1>
            
            <div className="relative">
              <select
                onChange={(e) => setViewType(e.target.value)}
                className="appearance-none bg-white/10 border border-emerald-300/30 text-white rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="table" className="bg-gray-800 text-white">Table View</option>
                <option value="type" className="bg-gray-800 text-white">Group by Type</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4">
            {records.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-green-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-white">No medical records found</h3>
                <p className="mt-1 text-sm text-green-200">
                  Your uploaded documents will appear here
                </p>
              </div>
            ) : viewType === "table" ? (
              <TableView records={records} />
            ) : (
              <AccordionView groupedRecords={groupedRecords} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const TableView = ({ records }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-green-300/20">
      <thead className="bg-white/5">
        <tr>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">
            #
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">
            File Name
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">
            File Type
          </th>
          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider">
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white/5 divide-y divide-green-300/20">
        {records.map((record, index) => (
          <tr key={index} className="hover:bg-white/10 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              {record.fileName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900/50 text-emerald-300">
                {record.fileType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AccordionView = ({ groupedRecords }) => (
  <div className="space-y-3">
    {Object.keys(groupedRecords).map((fileType, i) => (
      <div key={i} className="border border-emerald-300/20 rounded-lg overflow-hidden">
        <div className="bg-emerald-900/30 px-4 py-3 flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-medium text-white">{fileType}</h3>
          <span className="text-xs bg-emerald-800/50 text-emerald-300 px-2 py-1 rounded-full">
            {groupedRecords[fileType].length} records
          </span>
        </div>
        <div className="bg-white/5 divide-y divide-emerald-300/10">
          {groupedRecords[fileType].map((record, index) => (
            <div key={index} className="px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-colors">
              <span className="text-sm text-green-100">{record.fileName}</span>
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
); 

export default PatientDashboard;