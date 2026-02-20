import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
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
import HospitalLayout from "./Components/HospitalLayout";
import HospitalDashboard from "./Pages/Hospital/HospitalDashBoard"; // ⚠️ IMPORT MISSING THA

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
        element={
          user ? (
            user.role === "patient" ? (
              <Navigate to="/patient/dashboard" replace />
            ) : user.role === "distributor" ? (
              <Navigate to="/distributor/dashboard" replace />
            ) : (
              <Navigate to="/homepage" replace />
            )
          ) : (
            <AyushmaanChainLanding />
          )
        }
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {user && (
        <Route path="/*" element={<AuthenticatedRoutes user={user} />} />
      )}

      {/* Fallback for logged-out */}
      {!user && <Route path="*" element={<Navigate to="/" replace />} />}
    </Routes>
  );
}

function AuthenticatedRoutes({ user }) {
  const isPatient = user.role === "patient";
  const isDistributor = user.role === "distributor";

  return (
    <Routes>
      {isPatient && (
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
      )}

      {isDistributor && (
        <Route path="/distributor/dashboard" element={<HospitalDashboard />} />
      )}

      <Route
        path="/*"
        element={
          <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900 p-6">
            <Navbar />
            <Routes>
              <Route
                path="/homepage"
                element={
                  <Layout>
                    <HomePage />
                  </Layout>
                }
              />

              {/* Patient Routes */}
              {isPatient && (
                <Route path="/patient/*" element={<Layout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<PatientDashboard />} />
                  <Route path="medical-records" element={<MedicalRecords />} />
                  <Route path="grant-access" element={<GrantAccess />} />
                  <Route path="revoke-access" element={<RevokeAccess />} />
                  <Route path="my-doctors" element={<MyDoctors />} />
                  <Route path="prescription" element={<Prescription />} />
                </Route>
              )}

              {/* Doctor Routes */}
              {user.role === "doctor" && (
                <Route path="/doctor/*" element={<DoctorLayout />}>
                  <Route index element={<Navigate to="patient-manager" replace />} />
                  <Route path="patient-manager" element={<PatientManager />} />
                </Route>
              )}

              {/* Pharmacist Routes */}
              {user.role === "pharmacist" && (
                <Route path="/pharmacist/*" element={<PharmacistLayout />}>
                  <Route index element={<Navigate to="verify" replace />} />
                  <Route path="verify" element={<Verification />} />
                  <Route path="dispensed" element={<Dispensed />} />
                </Route>
              )}

              {/* Admin Routes */}
              {user.role === "admin" && (
                <Route path="/admin/*" element={<AdminLayout />}>
                  <Route index element={<Navigate to="assign-role" replace />} />
                  <Route path="assign-role" element={<AssignRole />} />
                </Route>
              )}

              {/* Manufacturer Routes */}
              {user.role === "manufacturer" && (
                <Route path="/manufacturer/*" element={<ManufacturerLayout />}>
                  <Route index element={<Navigate to="create-drug" replace />} />
                  <Route path="create-drug" element={<CreateDrug />} />
                  <Route path="drug-inventory" element={<DrugInventory />} />
                  <Route path="verify-drug" element={<VerifyDrug />} />
                </Route>
              )}

              {/* Distributor/Hospital Routes */}
              {user.role === "distributor" && (
                <Route path="/distributor/*" element={
                  <HospitalLayout>
                    <Routes>
                      <Route path="dashboard" element={<HospitalDashboard />} />
                      <Route path="*" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                  </HospitalLayout>
                } />
              )}

              {/* Default Redirect */}
              <Route
                path="*"
                element={
                  <Navigate
                    to={
                      isPatient 
                        ? "/patient/dashboard" 
                        : isDistributor 
                        ? "/distributor/dashboard" 
                        : "/homepage"
                    }
                    replace
                  />
                }
              />
            </Routes>
          </div>
        }
      />
    </Routes>
  );
}

export default App;