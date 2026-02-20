import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br ">
      {/* Main Content */}
      <main className="mx-6 mb-6">
        <div className="  p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;