import React, { useState } from "react";

const Dispensed = () => {
  const [link, setLink] = useState("");

  const handleSubmit = () => {
    if (!link.trim()) {
      alert("Please enter a valid link!");
      return;
    }
    window.open(link, "_blank");
    setLink("");
  };

  return (
    <div className="flex flex-col items-center  h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h1 className="text-xl font-bold text-gray-700 mb-4">Dispensed Prescription</h1>
        
        <input
          type="text"
          placeholder="Enter Prescription Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Open Prescription
        </button>
      </div>
    </div>
  );
};

export default Dispensed;
