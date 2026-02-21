import React, { useState, useEffect } from "react";
import { zeroPadBytes } from "ethers";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import { useAuth } from "../../context/AuthContext";
import useUserRegistry from "../../hooks/useUserRegistry";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogOut, Copy, Check, Search } from "lucide-react";

// Import components
import Sidebar from "./Sidebar";
import Header from "./Header";
import OverviewTab from "./OverviewTab";
import ProfileTab from "./ProfileTab";
import ExploreHospitalsTab from "./ExploreHospitalsTab";
import SurgeryPackagesTab from "./SurgeryPackagesTab";
import RehabStatusTab from "./RehabStatusTab";
import UploadRecordTab from "./UploadRecordTab";
import RecordsTab from "./RecordsTab";

const PatientDashboard = () => {
  const [records, setRecords] = useState([]);
  const [viewType, setViewType] = useState("table");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copied, setCopied] = useState(false);
  const { contract, account } = useMedicalRecord();
  const { contract: contractUser, account: accountUser } = useUserRegistry();
  const { user, setUser } = useAuth();

  // Upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [uploading, setUploading] = useState(false);

  const fileTypes = [
    "Blood Test Report",
    "X-Ray Report",
    "MRI Scan Report",
    "CT Scan Report",
    "ECG Report",
    "Doctor's Prescription",
    "Surgery Report",
    "Vaccination Record",
    "Allergy Report",
    "Dental Report",
    "Eye Examination Report",
    "Medical History Report",
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleCopy = () => {
    if (user?.wallet_address) {
      navigator.clipboard.writeText(user.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const showSuccessToast = (msg) => {
    toast.success(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const showErrorToast = (msg) => {
    toast.error(msg, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const computeSHA256 = async (file) => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    return [...new Uint8Array(hashBuffer)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile || !fileType || !fileName) {
      showErrorToast(
        "Please select a file, enter a file name, and choose a file type.",
      );
      return;
    }

    setUploading(true);
    try {
      const hash = await computeSHA256(selectedFile);
      const shaHashBytes32 = zeroPadBytes(`0x${hash}`, 32);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("fileName", fileName);

      const response = await fetch(
        `${import.meta.env.VITE_BACKENDLINK}/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const data = await response.json();

      if (!data.IpfsHash || !shaHashBytes32) {
        throw new Error("Missing IPFS hash or SHA256 hash.");
      }

      const tx = await contract.uploadRecord(
        fileName,
        fileType,
        data.IpfsHash,
        shaHashBytes32,
      );
      await tx.wait();

      showSuccessToast("Medical record uploaded successfully!");

      // Reset form
      setSelectedFile(null);
      setFileName("");
      setFileType("");

      // Refresh records
      const result = await contract.getRecords(account);
      const formattedRecords = result.map((record) => ({
        fileName: record[0],
        fileType: record[1],
        ipfsHash: record[2],
        sha256Hash: record[3],
        uploadedBy: record[4],
        isShared: record[5],
      }));
      setRecords(formattedRecords);

      // Switch to records tab
      setActiveTab("records");
    } catch (error) {
      console.error("Failed to upload medical record:", error);
      showErrorToast("Failed to upload medical record");
    } finally {
      setUploading(false);
    }
  };

  // Mock data for new features
  const [profile, setProfile] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john@example.com",
    phone: "+91 9876543210",
    dob: "1990-01-01",
    country: "India",
    county: "Mumbai",
    address: "123 Main Street, Mumbai",
    bloodGroup: "O+",
    emergencyContact: "+91 9876543211",
    passport: "P12345678",
    travelHistory: [
      { id: 1, date: "2024-10-15", type: "Visa Approved", status: "completed" },
      {
        id: 2,
        date: "2024-10-18",
        type: "Travel to Kenya",
        status: "completed",
      },
    ],
  });

  const [exploreHospitals, setExploreHospitals] = useState([
    {
      id: 1,
      name: "XYZ Heart Institute",
      location: "Nairobi, Kenya",
      rating: 4.8,
      reviews: 234,
      specialties: ["Cardiac Bypass", "Angioplasty", "Heart Transplant"],
      distance: "2.3 km",
      image: "/api/placeholder/400/200",
      verified: true,
      accreditation: "JCI Accredited",
      doctors: [
        {
          name: "Dr. Sarah Johnson",
          specialty: "Cardiac Surgeon",
          experience: "15 years",
        },
      ],
    },
    {
      id: 2,
      name: "Nairobi Medical Center",
      location: "Nairobi, Kenya",
      rating: 4.6,
      reviews: 189,
      specialties: ["Orthopedic", "Neurology", "General Surgery"],
      distance: "5.1 km",
      image: "/api/placeholder/400/200",
      verified: true,
      accreditation: "ISO Certified",
    },
    {
      id: 3,
      name: "Aga Khan University Hospital",
      location: "Nairobi, Kenya",
      rating: 4.9,
      reviews: 456,
      specialties: ["Multi-Specialty", "Cancer Care", "Cardiology"],
      distance: "7.8 km",
      image: "/api/placeholder/400/200",
      verified: true,
      accreditation: "Joint Commission International",
    },
  ]);

  const [surgeryPackages, setSurgeryPackages] = useState([
    {
      id: 1,
      name: "Cardiac Bypass Surgery",
      hospital: "XYZ Heart Institute",
      cost: 450000,
      currency: "INR",
      duration: "7-10 days",
      includes: ["Surgery", "5 days ICU", "10 days ward", "Follow-up"],
      blockchainVerified: true,
      verificationHash: "0x7d8f9e3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      rating: 4.9,
      savings: 60,
      comparedToUS: "Save 60% vs US",
    },
    {
      id: 2,
      name: "Hip Replacement",
      hospital: "Nairobi Medical Center",
      cost: 320000,
      currency: "INR",
      duration: "5-7 days",
      includes: ["Surgery", "Implant", "4 days ward", "Physiotherapy"],
      blockchainVerified: true,
      verificationHash: "0x8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r",
      rating: 4.7,
      savings: 55,
      comparedToUS: "Save 55% vs US",
    },
    {
      id: 3,
      name: "Knee Replacement",
      hospital: "Aga Khan University Hospital",
      cost: 380000,
      currency: "INR",
      duration: "6-8 days",
      includes: ["Surgery", "Premium Implant", "6 days ward", "Rehab plan"],
      blockchainVerified: true,
      verificationHash: "0x9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y",
      rating: 4.8,
      savings: 58,
      comparedToUS: "Save 58% vs US",
    },
  ]);

  const [rehabReferrals, setRehabReferrals] = useState([
    {
      id: 1,
      patientName: "John Doe",
      surgeryType: "Cardiac Bypass",
      surgeryDate: "2024-10-25",
      hospital: "XYZ Heart Institute",
      rehabCenter: "Nairobi Cardiac Rehab Center",
      status: "in-progress",
      startDate: "2024-11-05",
      duration: "2 weeks",
      progress: 35,
      coordinator: "Grace Mwangi",
      contact: "+254 700 345 678",
    },
  ]);

  const [selectedHospital, setSelectedHospital] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialty, setFilterSpecialty] = useState("all");

  useEffect(() => {
    const fetchRecords = async () => {
      if (contract && contractUser) {
        const isRegistered = await contractUser.isRegistered(accountUser);
        const result = await contract.getRecords(account);
        const formattedRecords = result.map((record) => ({
          fileName: record[0],
          fileType: record[1],
          ipfsHash: record[2],
          sha256Hash: record[3],
          uploadedBy: record[4],
          isShared: record[5],
        }));
        setRecords(formattedRecords);
      }
    };
    fetchRecords();
  }, [contract, account, accountUser, contractUser]);

  const groupedRecords = records.reduce((acc, record) => {
    acc[record.fileType] = acc[record.fileType] || [];
    acc[record.fileType].push(record);
    return acc;
  }, {});

  const filteredHospitals = exploreHospitals.filter(
    (hospital) =>
      hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospital.specialties.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const filteredPackages = surgeryPackages.filter(
    (pkg) =>
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.hospital.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: "User" },
    { id: "profile", label: "My Profile", icon: "User" },
    { id: "explore", label: "Explore Hospitals", icon: "Hospital" },
    { id: "packages", label: "Surgery Packages", icon: "Package" },
    { id: "rehab", label: "Rehab Status", icon: "Activity" },
    { id: "upload", label: "Upload Record", icon: "Upload" },
    { id: "records", label: "Medical Records", icon: "FileText" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
      />

      {/* Main Content */}
      <div className="lg:ml-0">
        <Header
          setSidebarOpen={setSidebarOpen}
          user={user}
          copied={copied}
          handleCopy={handleCopy}
          handleLogout={handleLogout}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabs={tabs}
        />

        {/* Global Search Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-300" />
            <input
              type="text"
              placeholder="Search hospitals, surgeries, or packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Tab Content */}
          {activeTab === "overview" && (
            <OverviewTab
              profile={profile}
              records={records}
              surgeryPackages={surgeryPackages}
              rehabReferrals={rehabReferrals}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "profile" && (
            <ProfileTab profile={profile} setProfile={setProfile} />
          )}

          {activeTab === "explore" && (
            <ExploreHospitalsTab
              hospitals={filteredHospitals}
              selectedHospital={selectedHospital}
              setSelectedHospital={setSelectedHospital}
              searchTerm={searchTerm}
              filterSpecialty={filterSpecialty}
              setFilterSpecialty={setFilterSpecialty}
            />
          )}

          {activeTab === "packages" && (
            <SurgeryPackagesTab packages={filteredPackages} />
          )}

          {activeTab === "rehab" && (
            <RehabStatusTab referrals={rehabReferrals} />
          )}

          {activeTab === "upload" && (
            <UploadRecordTab
              selectedFile={selectedFile}
              fileName={fileName}
              setFileName={setFileName}
              fileType={fileType}
              setFileType={setFileType}
              fileTypes={fileTypes}
              handleFileChange={handleFileChange}
              handleUploadSubmit={handleUploadSubmit}
              uploading={uploading}
            />
          )}

          {activeTab === "records" && (
            <RecordsTab
              records={records}
              groupedRecords={groupedRecords}
              viewType={viewType}
              setViewType={setViewType}
            />
          )}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default PatientDashboard;