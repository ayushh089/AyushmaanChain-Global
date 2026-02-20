import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./Components/Layout";
import DoctorLayout from "./Components/DoctorLayout";
import Navbar from "./Components/Navbar";
import MedicalRecords from "./Pages/Patient/MedicalRecords";
import PatientDashboard from "./Pages/Patient/PatientDashboard";
import GrantAccess from "./Pages/Patient/GrantAccess";
import PatientManager from "./Pages/Doctor/PatientManager";
import RevokeAccess from "./Pages/Patient/RevokeAccess";
import MyDoctors from "./Pages/Patient/MyDoctors";
import Prescription from "./Pages/Patient/Prescription";
import Verification from "./Pages/Verification";
import Dispensed from "./Pages/Pharmacy/Dispensed";
import PharmacistLayout from "./Components/PharmacistLayout";
import AdminLayout from "./Components/AdminLayout";
import AssignRole from "./Pages/Admin/AssignRole";
import ManufacturerLayout from "./Components/ManufacturerLayout";
import CreateDrug from "./Pages/Manufacturer/CreateDrug";
import DrugInventory from "./Pages/Manufacturer/DrugInventory";
import VerifyDrug from "./Pages/Manufacturer/VerifyDrug";
import AyushmaanChainLanding from "./Pages/AyushmaanChainLanding";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainContent />
      </Router>
    </AuthProvider>
  );
}

function MainContent() {
  const { user } = useAuth();
  console.log("Current User:", user);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/homepage" replace /> : <AyushmaanChainLanding />}
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {user && (
        <Route
          path="/*"
          element={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
              <Navbar />
              <Routes>
                <Route path="/homepage" element={<Layout><HomePage /></Layout>} />

                {user.role === "patient" && (
                  <Route path="/patient" element={<Layout />}>
                    <Route index element={<Navigate to="dashboard" replace />} />
                    <Route path="dashboard" element={<PatientDashboard />} />
                    <Route path="medical-records" element={<MedicalRecords />} />
                    <Route path="grant-access" element={<GrantAccess />} />
                    <Route path="revoke-access" element={<RevokeAccess />} />
                    <Route path="my-doctors" element={<MyDoctors />} />
                    <Route path="prescription" element={<Prescription />} />
                  </Route>
                )}

                {user.role === "doctor" && (
                  <Route path="/doctor" element={<DoctorLayout />}>
                    <Route index element={<Navigate to="patient-manager" replace />} />
                    <Route path="patient-manager" element={<PatientManager />} />
                  </Route>
                )}

                {user.role === "pharmacist" && (
                  <Route path="/pharmacist" element={<PharmacistLayout />}>
                    <Route index element={<Navigate to="verify" replace />} />
                    <Route path="verify" element={<Verification />} />
                    <Route path="dispensed" element={<Dispensed />} />
                  </Route>
                )}

                {user.role === "admin" && (
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Navigate to="assign-role" replace />} />
                    <Route path="assign-role" element={<AssignRole />} />
                  </Route>
                )}

                {user.role === "manufacturer" && (
                  <Route path="/manufacturer" element={<ManufacturerLayout />}>
                    <Route index element={<Navigate to="create-drug" replace />} />
                    <Route path="create-drug" element={<CreateDrug />} />
                    <Route path="drug-inventory" element={<DrugInventory />} />
                    <Route path="verify-drug" element={<VerifyDrug />} />
                  </Route>
                )}

                <Route path="*" element={<Navigate to="/homepage" replace />} />
              </Routes>
            </div>
          }
        />
      )}

      {/* Fallback for logged-out */}
      {!user && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
}


export default App;
