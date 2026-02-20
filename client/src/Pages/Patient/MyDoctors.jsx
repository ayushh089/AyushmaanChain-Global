import React, { useEffect, useState } from "react";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import useUserRegistry from "../../hooks/useUserRegistry";
import axios from "axios";
import { Copy, Mail, Phone } from "lucide-react"; // Import icons

const MyDoctors = () => {
  const { contract, account } = useMedicalRecord();
  const { contract: contractUser } = useUserRegistry();
  const [doctors, setDoctors] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        if (!contractUser || !account) return;

        console.log("Fetching doctors for:", account);
        const doctorsList = await contract.getAccessList(account);
        console.log("Doctors:", doctorsList.length);

        setDoctors(doctorsList);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [contractUser, account]);

  useEffect(() => {
    console.log("Fetching doctor details...");

    const fetchData = async () => {
      if (doctors.length === 0) return;

      try {
        const doctorData = await Promise.all(
          doctors.map(async (doctor) => {
            const response = await axios.post(
              `${import.meta.env.VITE_BACKENDLINK}/fetchData`,
              { walletAddress: doctor }
            );
            return {
              name: response.data.name.toUpperCase(),
              gmail: response.data.gmail,
              phone: response.data.phone
            };
          })
        );

        setDoctorDetails(doctorData);
        console.log("Doctors fetched:", doctorData);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };

    fetchData();
  }, [doctors]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Doctors</h1>

      {doctorDetails.length === 0 ? (
        <p className="text-center text-gray-600">No doctors have access to your records.</p>
      ) : (
        <div className="w-full overflow-x-auto">
          <table className="max-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                {/* <th className="py-3 px-4 text-center">Actions</th> */}
              </tr>
            </thead>
            <tbody>
              {doctorDetails.map((doctor, index) => (
                <tr key={index} className="border-b hover:bg-gray-100 transition-all">
                  <td className="py-3 px-4">{doctor.name}</td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    {doctor.gmail}
                    <button onClick={() => copyToClipboard(doctor.gmail)} className="ml-2">
                      <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </td>
                  <td className="py-3 px-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-500" />
                    {doctor.phone}
                    <button onClick={() => copyToClipboard(doctor.phone)} className="ml-2">
                      <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <a
                      href={`mailto:${doctor.gmail}`}
                      className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition"
                    >
                      Contact
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyDoctors;
