import { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "../contract/UserAccessControl.json";

const CONTRACT_ABI = abi.abi;
const CONTRACT_ADDRESS = import.meta.env.VITE_USERACCESSCONTROL; // Replace with actual contract address

const useAccessControl = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const connectToBlockchain = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const wallet = new ethers.Wallet(
          import.meta.env.VITE_PRIVATE_KEY,
          provider
        );

        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          wallet
        );

        setContract(contractInstance);
        setAccount(wallet.address);
        console.log("Connected to blockchain(AccessControl):", wallet.address);
      } catch (error) {
        console.error("Blockchain connection error:", error);
      }
    };

    connectToBlockchain();
  }, []);



  return { contract, account };
};

export default useAccessControl;
