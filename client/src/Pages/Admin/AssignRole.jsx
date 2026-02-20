import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useAccessControl from "../../hooks/useAccessControl";

const AssignRole = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [role, setRole] = useState("Manufacturer");
  const [loading, setLoading] = useState(false);
  const { contract } = useAccessControl();

  const grantAccess = async () => {
    if (!walletAddress) return toast.error("Please enter wallet address");
    if (!role) return toast.error("Please select a role");

    if (contract) {
      try {
        setLoading(true);
        let tx;

        if (role === "Manufacturer") {
          tx = await contract.addManufacturer(walletAddress);
        //   console.log("add manuf");
          
        } else if (role === "Distributor") {
          tx = await contract.addDistributor(walletAddress);
        } else if (role === "Pharmacy") {
          tx = await contract.addPharmacy(walletAddress);
        }

        await tx.wait();
        toast.success(`${role} role assigned successfully`);
        setWalletAddress("");
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.reason) {
          console.error("Revert Reason:", error.reason);
          toast.error(error.reason);
        } else if (error.data && error.data.message) {
          console.error("Revert Reason:", error.data.message);
          toast.error(error.data.message);
        } else {
          console.error("Transaction failed:", error);
          toast.error("Transaction failed");
        }
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    grantAccess();
  };

  return (
    <div className="bg-gray-100 flex flex-col items-center justify-center p-4 w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Grant Access</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wallet Address
          </label>
          <input
            type="text"
            value={walletAddress}
            placeholder="Enter wallet address"
            onChange={(e) => setWalletAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Manufacturer">Manufacturer</option>
            <option value="Distributor">Distributor</option>
            <option value="Pharmacy">Pharmacy</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 border-t-2 border-white rounded-full"
                viewBox="0 0 24 24"
              ></svg>
              Assigning...
            </div>
          ) : (
            "Assign Role"
          )}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default AssignRole;
