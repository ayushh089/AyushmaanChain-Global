import { useState } from "react";
import { Link } from "react-router-dom";
import ViewRecords from "./ViewRecords";
import AddPrescription from "./AddPrescription";

const PatientManager = () => {
  const [selectedOption, setSelectedOption] = useState("add");

  return (
    <div className="flex h-screen w-full ">
      
      <aside className="w-1/4 bg-green-100 p-4">
        <h2 className="text-lg font-bold mb-4">Patient Manager</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setSelectedOption("add")} className="w-full text-left px-4 py-2 bg-white rounded hover:bg-green-200">
              ➕ Add Prescription
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedOption("view")} className="w-full text-left px-4 py-2 bg-white rounded hover:bg-green-200">
              📜 View Records
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedOption("access")} className="w-full text-left px-4 py-2 bg-white rounded hover:bg-green-200">
              🔑 Request Access
            </button>
          </li>
        </ul>
      </aside>

      {/* Right Content Area */}
      <main className="flex-1 p-4 bg-gray-50">
        {selectedOption === "add" && <AddPrescription />}
        {selectedOption === "view" && <ViewRecords/>}
        {/* {selectedOption === "access" && <RequestAccess />} */}
      </main>
    </div>
  );
};

export default PatientManager;
