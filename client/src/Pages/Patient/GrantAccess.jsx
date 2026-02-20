import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import useUserRegistry from "../../hooks/useUserRegistry";
import useMedicalRecord from "../../hooks/useMedicalRecord";

const GrantAccess = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const { contract, account } = useMedicalRecord();
  const { contract: contractUser, account: accountUser } = useUserRegistry();

  const grantAccess = async () => {
    if (contract) {
      console.log("Granting access to:", walletAddress);
      try {
        setLoading(true);
        const tx = await contract.grantAccess(walletAddress);
        await tx.wait();
        toast.success("Access granted successfully");
        // alert("Access granted successfully");
        setWalletAddress("");
        setLoading  (false);
      } catch (error) {
        if (error.reason) {
          console.error("Revert Reason:", error.reason);
        } else if (error.data && error.data.message) {
          console.error("Revert Reason:", error.data.message);
        } else {
          console.error("Transaction failed:", error);
        }
      }
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    grantAccess();
  };
  return (
    <div className=" flex flex-col items-center justify-center p-4 w-full h-screen">
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
              Granting...
            </div>
          ) : (
            "Grant Permission"
          )}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default GrantAccess;
