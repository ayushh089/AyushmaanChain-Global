import Layout from "../Components/Layout";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="w-full min-h-screen bg-gray-100">

      <div className="flex flex-col items-center justify-center py-10">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name || "Guest"}!
        </h1>
        <p>Your Wallet Address: {user?.wallet_address}</p>
        <p>Your DOB: {user?.date_of_birth}</p>
        <p>Your ROLE: {user?.role}</p>
      </div>
    </div>
  );
};

export default HomePage;
