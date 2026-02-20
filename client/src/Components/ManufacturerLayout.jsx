import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManufacturerLayout = () => {
  const { user } = useAuth();

  return (
    <div className=" bg-gradient-to-br ">
      {/* Main Content */}
      <main className="">
        <div className=" ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ManufacturerLayout;