import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PharmacistLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
      {/* Main Content */}
      <main className="mx-6 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 min-h-[calc(100vh-200px)] p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default PharmacistLayout;