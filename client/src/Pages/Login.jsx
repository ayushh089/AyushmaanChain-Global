import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Login = () => {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Connect to Metamask
      setStatus("Connecting wallet...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      console.log(accounts);
      
      const walletAddress = accounts[0];

      // Step 2: Get challenge from backend
      setStatus("Requesting challenge...");
      const challengeResponse = await axios.get(
        `${import.meta.env.VITE_BACKENDLINK}/challenge`,
        { params: { walletAddress } }
      );
      const challengeMessage = challengeResponse.data.challenge;

      // Step 3: Sign challenge using Metamask
      setStatus("Signing challenge...");
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(challengeMessage);

      // Step 4: Authenticate
      setStatus("Authenticating...");
      console.log("Authenticating...", { walletAddress, challengeMessage, signature });
      const loginResponse = await axios.post(
        `${import.meta.env.VITE_BACKENDLINK}/login`,
        { walletAddress, challengeMessage, signature }
      );
console.log("Login response:", loginResponse.data);
      const userData = loginResponse.data.profile.rows[0];
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/homepage");

    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed! ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center mt-[8rem]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Login with MetaMask</h2>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                loading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? status : "Connect Wallet"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
