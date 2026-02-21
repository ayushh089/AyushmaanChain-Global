import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { debounce } from "lodash";
import useUserRegistry from "../hooks/useUserRegistry";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const { contract, account } = useUserRegistry();
  const [userType, setUserType] = useState("patient");
  const navigate = useNavigate();
  const formRef = useRef({
    name: "",
    userType: "patient",
  });

  const handleChange = debounce((e) => {
    const { name, value } = e.target;
    if (name === "userType") setUserType(value);
    formRef.current = { ...formRef.current, [name]: value };
  }, 300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) return alert("Please connect your wallet first!");

    try {
      const offChainData = {
        name: formRef.current.name,
        role: formRef.current.userType,
        wallet_address: account.toLowerCase(),
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKENDLINK}/register`,
        { offChainData },
        { withCredentials: true },
      );

      if (response.data.user_id && register()) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        throw new Error("Failed to store off-chain data");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed! Please try again=>" + error.response?.data);
    }
  };

  const register = async () => {
    try {
      const tx = await contract.registerUser(formRef.current.userType);
      await tx.wait();
      alert("User successfully gets a Block!");
      return 1;
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.reason || "Registration failed! Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mt-[8rem]">
          {/* Left Side - App Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="flex items-center">
              <svg
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <h1 className="ml-3 text-3xl font-bold text-green-800">
                AyushmaanChain
              </h1>
            </div>

            <h2 className="text-2xl font-bold text-gray-800">
              Join the Healthcare Revolution
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Secure, tamper-proof medical records on blockchain
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  NFT-based prescriptions for complete authenticity
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Merkle tree verification for drug authenticity
                </p>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <svg
                    className="h-5 w-5 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">
                  Patient-controlled access to medical data
                </p>
              </div>
            </div>

            <div className="bg-green-100 p-4 rounded-lg border border-green-200">
              <h3 className="font-medium text-green-800">
                Already have an account?
              </h3>
              <button
                onClick={() => navigate("/login")}
                className="mt-2 text-green-600 hover:text-green-800 font-medium"
              >
                Sign in here →
              </button>
            </div>
          </motion.div>

          {/* Right Side - Signup Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full lg:w-1/2 bg-auto p-8 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create Your Account
            </h2>

            {account && (
              <div className="mb-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">Connected wallet:</p>
                <p className="font-mono text-sm text-gray-800 truncate">
                  {account}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="userType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacist">Pharmacist</option>
                  <option value="admin">Admin</option>
                  <option value="manufacturer">Manufacturer</option>
                  <option value="distributor">Hospital</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition duration-200"
              >
                Register
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              By registering, you agree to our{" "}
              <a href="#" className="text-green-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-green-600 hover:underline">
                Privacy Policy
              </a>
              .
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
