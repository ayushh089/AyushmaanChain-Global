import React, { useState, useEffect } from "react";
import { zeroPadBytes } from "ethers";
import useMedicalRecord from "../../hooks/useMedicalRecord";
import { useAuth } from "../../context/AuthContext";
import useUserRegistry from "../../hooks/useUserRegistry";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  FileText,
  Hospital,
  Package,
  Activity,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Shield,
  Download,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Menu,
  X,
  Bell,
  Heart,
  Globe,
  DollarSign,
  Star,
  ThumbsUp,
  Award,
  ChevronRight,
  Search,
  Filter,
  Info,
  LogOut,
  Copy,
  Check,
  Upload,
  Plus,
} from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-emerald-900">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-20 transition-opacity lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 w-64 bg-white/10 backdrop-blur-xl transform transition-transform duration-300 ease-in-out z-30 lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <X className="h-6 w-6" />
          </button>
          <nav className="mt-8">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "profile", label: "My Profile", icon: User },
              { id: "explore", label: "Explore Hospitals", icon: Hospital },
              { id: "packages", label: "Surgery Packages", icon: Package },
              { id: "rehab", label: "Rehab Status", icon: Activity },
              { id: "upload", label: "Upload Record", icon: Upload },
              { id: "records", label: "Medical Records", icon: FileText },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2 py-2 px-4 rounded-lg mb-1 transition-colors ${
                    activeTab === item.id
                      ? "bg-emerald-600 text-white"
                      : "text-green-100 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-0">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden mr-4 text-white"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <span className="text-xl font-bold text-white tracking-wide">
                  AyushmaanChain
                </span>
              </div>
              <div className="flex items-center space-x-4">
                {/* Wallet Address */}
                <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="text-sm text-white font-medium">
                    {user.wallet_address.slice(0, 6)}...
                    {user.wallet_address.slice(-4)}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/20"
                    title={copied ? "Copied!" : "Copy address"}
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>

                {/* User Profile */}
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-green-200 capitalize font-medium">
                      {user.role}
                    </p>
                    <p className="text-sm font-semibold text-white">
                      {user.name}
                    </p>
                  </div>

                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=2563eb&length=1&unique=${user.wallet_address}`}
                      alt="Avatar"
                      className="rounded-full w-10 h-10 border-2 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="hidden sm:flex items-center space-x-2 bg-white/10 hover:bg-red-500/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation - Desktop */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-1 bg-white/5 rounded-lg p-1 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: User },
              { id: "profile", label: "My Profile", icon: User },
              { id: "explore", label: "Explore Hospitals", icon: Hospital },
              { id: "packages", label: "Surgery Packages", icon: Package },
              { id: "rehab", label: "Rehab Status", icon: Activity },
              { id: "upload", label: "Upload Record", icon: Upload },
              { id: "records", label: "Medical Records", icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "text-green-100 hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

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

// Overview Tab
const OverviewTab = ({
  profile,
  records,
  surgeryPackages,
  rehabReferrals,
  setActiveTab,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left Column */}
    <div className="lg:col-span-2 space-y-6">
      {/* Welcome Card */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Welcome back, <span className="text-emerald-300">{profile.name}</span>
        </h2>
        <p className="text-green-200">Your medical journey continues</p>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <button
            onClick={() => setActiveTab("explore")}
            className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Hospital className="h-5 w-5 text-emerald-400 mb-1" />
            <span className="text-xs text-white">Find Hospital</span>
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Package className="h-5 w-5 text-emerald-400 mb-1" />
            <span className="text-xs text-white">View Packages</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <FileText className="h-5 w-5 text-emerald-400 mb-1" />
            <span className="text-xs text-white">Upload Record</span>
          </button>
          <button
            onClick={() => setActiveTab("rehab")}
            className="flex flex-col items-center p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Activity className="h-5 w-5 text-emerald-400 mb-1" />
            <span className="text-xs text-white">Track Rehab</span>
          </button>
        </div>
      </div>

      {/* Active Rehab */}
      {rehabReferrals.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Activity className="h-5 w-5 mr-2 text-emerald-400" />
            Active Rehabilitation
          </h3>
          {rehabReferrals.map((rehab) => (
            <div key={rehab.id} className="bg-white/5 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-white font-medium">{rehab.rehabCenter}</p>
                  <p className="text-sm text-green-200">
                    Post {rehab.surgeryType}
                  </p>
                </div>
                <span className="px-3 py-1 bg-emerald-600/30 text-emerald-300 rounded-full text-xs">
                  {rehab.progress}% Complete
                </span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${rehab.progress}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-green-300">
                  <span>Started: {rehab.startDate}</span>
                  <span>Duration: {rehab.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Right Column */}
    <div className="space-y-6">
      {/* Profile Summary */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <User className="h-5 w-5 mr-2 text-emerald-400" />
          Profile Summary
        </h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-green-300">Blood Group</p>
            <p className="text-white font-medium">{profile.bloodGroup}</p>
          </div>
          <div>
            <p className="text-xs text-green-300">Emergency Contact</p>
            <p className="text-white font-medium">{profile.emergencyContact}</p>
          </div>
          <div>
            <p className="text-xs text-green-300">Passport</p>
            <p className="text-white font-medium">{profile.passport}</p>
          </div>
        </div>
      </div>

      {/* Recent Packages */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Package className="h-5 w-5 mr-2 text-emerald-400" />
          Popular Packages
        </h3>
        <div className="space-y-3">
          {surgeryPackages.slice(0, 2).map((pkg) => (
            <div key={pkg.id} className="bg-white/5 rounded-lg p-3">
              <div className="flex justify-between">
                <p className="text-white text-sm font-medium">{pkg.name}</p>
                <span className="text-xs bg-emerald-600/30 text-emerald-300 px-2 py-1 rounded">
                  {pkg.savings}% off
                </span>
              </div>
              <p className="text-xs text-green-300 mt-1">{pkg.hospital}</p>
              <p className="text-sm text-white mt-1">
                ₹{pkg.cost.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Profile Tab
const ProfileTab = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <User className="h-5 w-5 mr-2 text-emerald-400" />
          My Profile
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Edit Profile
          </button>
        ) : (
          <div className="space-x-2">
            <button
              onClick={() => {
                setEditedProfile(profile);
                setIsEditing(false);
              }}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-3">
            Personal Information
          </h3>

          <div>
            <label className="block text-sm text-green-300 mb-1">
              Full Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, name: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">Email</label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, email: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, phone: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">
              Date of Birth
            </label>
            {isEditing ? (
              <input
                type="date"
                value={editedProfile.dob}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, dob: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.dob}</p>
            )}
          </div>
        </div>

        {/* Address & Medical Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white mb-3">
            Address & Medical Info
          </h3>

          <div>
            <label className="block text-sm text-green-300 mb-1">Country</label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.country}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    country: e.target.value,
                  })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.country}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">
              County/City
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.county}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, county: e.target.value })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              />
            ) : (
              <p className="text-white">{profile.county}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">Address</label>
            {isEditing ? (
              <textarea
                value={editedProfile.address}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    address: e.target.value,
                  })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                rows="2"
              />
            ) : (
              <p className="text-white">{profile.address}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-green-300 mb-1">
              Blood Group
            </label>
            {isEditing ? (
              <select
                value={editedProfile.bloodGroup}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    bloodGroup: e.target.value,
                  })
                }
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            ) : (
              <p className="text-white">{profile.bloodGroup}</p>
            )}
          </div>
        </div>
      </div>

      {/* Travel History */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-white mb-4">Travel History</h3>
        <div className="space-y-3">
          {profile.travelHistory.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center">
                <Globe className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-white text-sm">{item.type}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-green-300 mr-3">{item.date}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.status === "completed"
                      ? "bg-green-600/30 text-green-300"
                      : "bg-yellow-600/30 text-yellow-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Explore Hospitals Tab
const ExploreHospitalsTab = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
  searchTerm,
  filterSpecialty,
  setFilterSpecialty,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Hospital List */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <Hospital className="h-5 w-5 mr-2 text-emerald-400" />
          Partner Hospitals
        </h2>

        {hospitals.map((hospital) => (
          <div
            key={hospital.id}
            onClick={() => setSelectedHospital(hospital)}
            className={`bg-white/10 backdrop-blur-md rounded-xl border transition-all cursor-pointer ${
              selectedHospital?.id === hospital.id
                ? "border-emerald-500 bg-white/20"
                : "border-white/20 hover:bg-white/15"
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {hospital.name}
                  </h3>
                  <p className="text-sm text-green-200 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {hospital.location}
                  </p>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white ml-1">{hospital.rating}</span>
                  <span className="text-xs text-green-300 ml-1">
                    ({hospital.reviews})
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {hospital.specialties.map((specialty, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-emerald-600/30 text-emerald-300 rounded-full text-xs"
                  >
                    {specialty}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 text-emerald-400 mr-1" />
                  <span className="text-xs text-green-300">
                    {hospital.accreditation}
                  </span>
                </div>
                <span className="text-sm text-white">{hospital.distance}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hospital Details */}
      <div className="lg:col-span-1">
        {selectedHospital ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              {selectedHospital.name}
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-green-300">Location</p>
                <p className="text-white text-sm">
                  {selectedHospital.location}
                </p>
              </div>

              <div>
                <p className="text-xs text-green-300">Accreditation</p>
                <p className="text-white text-sm">
                  {selectedHospital.accreditation}
                </p>
              </div>

              <div>
                <p className="text-xs text-green-300">Specialties</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedHospital.specialties.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-emerald-600/30 text-emerald-300 rounded-full text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-green-300">Doctors</p>
                {selectedHospital.doctors ? (
                  selectedHospital.doctors.map((doctor, idx) => (
                    <div key={idx} className="mt-2 bg-white/5 rounded-lg p-2">
                      <p className="text-white text-sm">{doctor.name}</p>
                      <p className="text-xs text-green-300">
                        {doctor.specialty} • {doctor.experience}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white mt-1">
                    Information available on request
                  </p>
                )}
              </div>

              <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                Contact Hospital
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
            <Hospital className="h-12 w-12 text-green-300 mx-auto mb-3" />
            <p className="text-white">Select a hospital to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Surgery Packages Tab
const SurgeryPackagesTab = ({ packages }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-white flex items-center">
      <Package className="h-5 w-5 mr-2 text-emerald-400" />
      Surgery Packages
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
        <div
          key={pkg.id}
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
              {pkg.blockchainVerified && (
                <div className="flex items-center bg-emerald-600/30 px-2 py-1 rounded-full">
                  <Shield className="h-3 w-3 text-emerald-400 mr-1" />
                  <span className="text-xs text-emerald-300">Verified</span>
                </div>
              )}
            </div>

            <p className="text-sm text-green-200 mt-1">{pkg.hospital}</p>

            <div className="mt-4 flex items-baseline">
              <span className="text-2xl font-bold text-white">
                ₹{pkg.cost.toLocaleString()}
              </span>
              <span className="text-xs text-green-300 ml-2">
                {pkg.currency}
              </span>
            </div>

            <div className="mt-2 flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-white ml-1">{pkg.rating}</span>
              <span className="text-xs text-green-300 ml-2">
                {pkg.comparedToUS}
              </span>
            </div>

            <div className="mt-4">
              <p className="text-xs text-green-300 mb-2">Package includes:</p>
              <ul className="space-y-1">
                {pkg.includes.map((item, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-white flex items-center"
                  >
                    <CheckCircle className="h-3 w-3 text-emerald-400 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4">
              <p className="text-xs text-green-300">Duration: {pkg.duration}</p>
            </div>

            {pkg.blockchainVerified && (
              <div className="mt-4 p-2 bg-white/5 rounded-lg">
                <p className="text-xs text-green-300 break-all">
                  Hash: {pkg.verificationHash.substring(0, 20)}...
                </p>
              </div>
            )}

            <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
              View Package
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Rehab Status Tab
const RehabStatusTab = ({ referrals }) => (
  <div className="space-y-6">
    <h2 className="text-xl font-bold text-white flex items-center">
      <Activity className="h-5 w-5 mr-2 text-emerald-400" />
      Rehabilitation Status
    </h2>

    {referrals.length > 0 ? (
      referrals.map((referral) => (
        <div
          key={referral.id}
          className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Progress Section */}
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-white mb-4">
                {referral.rehabCenter}
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-green-200 mb-1">
                    <span>Recovery Progress</span>
                    <span>{referral.progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div
                      className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${referral.progress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-green-300">Surgery Type</p>
                    <p className="text-white font-medium">
                      {referral.surgeryType}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-green-300">Surgery Date</p>
                    <p className="text-white font-medium">
                      {referral.surgeryDate}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-green-300">Rehab Started</p>
                    <p className="text-white font-medium">
                      {referral.startDate}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-green-300">
                      Expected Completion
                    </p>
                    <p className="text-white font-medium">
                      {new Date(
                        new Date(referral.startDate).getTime() +
                          14 * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Daily Schedule */}
                <div className="mt-4">
                  <h4 className="text-md font-medium text-white mb-3">
                    Today's Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white">Morning Physiotherapy</p>
                        <p className="text-xs text-green-300">with Dr. James</p>
                      </div>
                      <span className="text-sm text-emerald-300">9:00 AM</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white">Cardiac Exercise</p>
                        <p className="text-xs text-green-300">
                          with Nurse Mary
                        </p>
                      </div>
                      <span className="text-sm text-emerald-300">2:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div>
                        <p className="text-white">Nutrition Counseling</p>
                        <p className="text-xs text-green-300">with Dr. Sarah</p>
                      </div>
                      <span className="text-sm text-emerald-300">5:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact & Info */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-3">
                  Rehab Coordinator
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-emerald-400 mr-2" />
                    <span className="text-white">{referral.coordinator}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-emerald-400 mr-2" />
                    <span className="text-white">{referral.contact}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <h4 className="text-white font-medium mb-2">Quick Actions</h4>
                  <button className="w-full mb-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm">
                    Message Coordinator
                  </button>
                  <button className="w-full px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm">
                    View Rehab Plan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
        <Activity className="h-16 w-16 text-green-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          No Active Rehabilitation
        </h3>
        <p className="text-green-200">
          Your rehab information will appear here when assigned
        </p>
      </div>
    )}
  </div>
);

// Upload Record Tab
const UploadRecordTab = ({
  selectedFile,
  fileName,
  setFileName,
  fileType,
  setFileType,
  fileTypes,
  handleFileChange,
  handleUploadSubmit,
  uploading,
}) => (
  <div className="max-w-3xl mx-auto">
    <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
          <Upload className="h-6 w-6 mr-2 text-emerald-400" />
          Upload Medical Record
        </h2>
        <p className="text-green-200">
          Securely upload your medical documents to the blockchain
        </p>
      </div>

      <form onSubmit={handleUploadSubmit} className="space-y-6">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-green-100 mb-2">
            Upload Medical File
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-green-300/30 border-dashed rounded-lg hover:border-emerald-400/50 transition-colors">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-green-200"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-green-100">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-emerald-600/20 rounded-md font-medium text-emerald-300 hover:text-white focus-within:outline-none px-3 py-1"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    required
                  />
                </label>
                <p className="pl-1 text-green-100">or drag and drop</p>
              </div>
              <p className="text-xs text-green-200/80">
                PDF, JPG, PNG up to 10MB
              </p>
            </div>
          </div>
          {selectedFile && (
            <div className="mt-3 p-3 bg-emerald-600/20 rounded-lg border border-emerald-400/30">
              <p className="text-sm text-white flex items-center">
                <FileText className="h-4 w-4 mr-2 text-emerald-400" />
                Selected:{" "}
                <span className="font-medium ml-1">{selectedFile.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* File Name */}
        <div>
          <label
            htmlFor="filename"
            className="block text-sm font-medium text-green-100 mb-2"
          >
            File Name
          </label>
          <input
            type="text"
            id="filename"
            value={fileName}
            placeholder="e.g. Annual Checkup 2024"
            onChange={(e) => setFileName(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-green-200/50"
            required
          />
        </div>

        {/* File Type */}
        <div>
          <label
            htmlFor="filetype"
            className="block text-sm font-medium text-green-100 mb-2"
          >
            Document Type
          </label>
          <select
            id="filetype"
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="block w-full px-4 py-3 rounded-lg bg-white/5 border border-green-300/30 focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white"
            required
          >
            <option value="" disabled className="text-gray-500">
              Select document type
            </option>
            {fileTypes.map((type, index) => (
              <option
                key={index}
                value={type}
                className="text-gray-800 bg-white"
              >
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={uploading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white ${
              uploading
                ? "bg-green-800 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Upload Medical Record
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  </div>
);

// Records Tab (Your existing medical records with updated styling)
const RecordsTab = ({ records, groupedRecords, viewType, setViewType }) => (
  <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-xl font-bold text-white flex items-center">
        <Shield className="h-5 w-5 mr-2 text-emerald-400" />
        Medical Records
        <span className="ml-3 text-sm font-normal text-green-300 bg-emerald-600/30 px-2 py-1 rounded-full">
          Blockchain Secured
        </span>
      </h2>

      <div className="relative">
        <select
          value={viewType}
          onChange={(e) => setViewType(e.target.value)}
          className="appearance-none bg-white/10 border border-emerald-300/30 text-white rounded-lg pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="table" className="bg-gray-800 text-white">
            Table View
          </option>
          <option value="type" className="bg-gray-800 text-white">
            Group by Type
          </option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>

    <div className="bg-white/5 rounded-lg p-4">
      {records.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="mx-auto h-12 w-12 text-green-200" />
          <h3 className="mt-2 text-lg font-medium text-white">
            No medical records found
          </h3>
          <p className="mt-1 text-sm text-green-200">
            Your uploaded documents will appear here
          </p>
        </div>
      ) : viewType === "table" ? (
        <TableView records={records} />
      ) : (
        <AccordionView groupedRecords={groupedRecords} />
      )}
    </div>
  </div>
);

// Your existing TableView and AccordionView components (unchanged)
const TableView = ({ records }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-green-300/20">
      <thead className="bg-white/5">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            #
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            File Name
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            File Type
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-green-200 uppercase tracking-wider"
          >
            Action
          </th>
        </tr>
      </thead>
      <tbody className="bg-white/5 divide-y divide-green-300/20">
        {records.map((record, index) => (
          <tr key={index} className="hover:bg-white/10 transition-colors">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
              {index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              {record.fileName}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-900/50 text-emerald-300">
                {record.fileType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const AccordionView = ({ groupedRecords }) => (
  <div className="space-y-3">
    {Object.keys(groupedRecords).map((fileType, i) => (
      <div
        key={i}
        className="border border-emerald-300/20 rounded-lg overflow-hidden"
      >
        <div className="bg-emerald-900/30 px-4 py-3 flex justify-between items-center cursor-pointer">
          <h3 className="text-sm font-medium text-white">{fileType}</h3>
          <span className="text-xs bg-emerald-800/50 text-emerald-300 px-2 py-1 rounded-full">
            {groupedRecords[fileType].length} records
          </span>
        </div>
        <div className="bg-white/5 divide-y divide-emerald-300/10">
          {groupedRecords[fileType].map((record, index) => (
            <div
              key={index}
              className="px-4 py-3 flex justify-between items-center hover:bg-white/10 transition-colors"
            >
              <span className="text-sm text-green-100">{record.fileName}</span>
              <a
                href={`${import.meta.env.VITE_PINATA_LINK}${record.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 text-sm flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default PatientDashboard;
