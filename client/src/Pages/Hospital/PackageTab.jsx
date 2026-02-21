import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Eye,
  Shield,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  Star,
  Users,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Download,
  RefreshCw,
} from "lucide-react";
import AddPackageModal from "./AddPackageModal";
import EditPackageModal from "./EditPackageModal";
import useHospitalPackageRegistry from "../../hooks/useHospitalPackageRegistry";

const PackageTab = ({ doctors }) => {
  const { contract, account } = useHospitalPackageRegistry();

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Fetch packages from blockchain
  const fetchPackages = async () => {
    if (!contract || !account) {
      console.log("Contract or account not ready");
      return;
    }

    try {
      setLoading(true);
      console.log("Fetching packages for hospital:", account);

      // Get all package IDs for this hospital
      const packageIds = await contract.getHospitalPackages(account);
      console.log("Package IDs:", packageIds);

      // Fetch details for each package
      const packageDetails = [];
      for (const id of packageIds) {
        try {
          const pkg = await contract.getPackage(id);

          // Parse metadata (stored as JSON string)
          let metadata = {};
          try {
            metadata = JSON.parse(pkg.metadataHash);
          } catch (e) {
            console.log("Metadata parse error:", e);
            metadata = {
              duration: "",
              includes: [],
              excludes: [],
            };
          }

          packageDetails.push({
            id: pkg.packageId,
            packageId: pkg.packageId,
            name: pkg.name,
            cost: Number(pkg.price),
            price: pkg.price.toString(),
            currency: "INR",
            hospital: pkg.hospital,
            blockchainVerified: true,
            verificationHash: pkg.metadataHash,
            timestamp: new Date(Number(pkg.timestamp) * 1000).toLocaleString(),
            status: "active",
            duration: metadata.duration || "Not specified",
            includes:
              typeof metadata.includes === "string"
                ? metadata.includes.split("\n")
                : metadata.includes || [],
            excludes:
              typeof metadata.excludes === "string"
                ? metadata.excludes.split("\n")
                : metadata.excludes || [],
            rating: 4.9,
            savings: 60,
            availableSlots: 5,
            doctors: metadata.doctors || [],
          });
        } catch (err) {
          console.error(`Error fetching package ${id}:`, err);
        }
      }

      console.log("Fetched packages:", packageDetails);
      setPackages(packageDetails);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load packages on mount and when account changes
  useEffect(() => {
    fetchPackages();
  }, [contract, account]);

  const filteredPackages = packages.filter((pkg) => {
    const matchesSearch =
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || pkg.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddPackage = async (newPackage) => {
    setShowAddModal(false);
    // Refresh packages from blockchain
    await fetchPackages();
  };

  const handleEditPackage = (updatedPackage) => {
    setPackages(
      packages.map((p) => (p.id === updatedPackage.id ? updatedPackage : p)),
    );
    setShowEditModal(null);
  };

  const handleDeletePackage = (id) => {
    if (window.confirm("Are you sure you want to delete this package?")) {
      setPackages(packages.filter((p) => p.id !== id));
    }
  };

  const handleToggleStatus = (id) => {
    setPackages(
      packages.map((p) =>
        p.id === id
          ? { ...p, status: p.status === "active" ? "inactive" : "active" }
          : p,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <Package className="h-5 w-5 mr-2 text-emerald-400" />
              Surgery Packages
            </h2>
            <p className="text-sm text-green-200 mt-1">
              Manage your hospital's treatment packages
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Package
          </button>
        </div>

        {/* Search, Filter and Refresh */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-300" />
            <input
              type="text"
              placeholder="Search packages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white/10 border border-white/20 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all" className="bg-gray-800">
              All Status
            </option>
            <option value="active" className="bg-gray-800">
              Active
            </option>
            <option value="inactive" className="bg-gray-800">
              Inactive
            </option>
          </select>
          <button
            onClick={fetchPackages}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Packages Grid */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-white">Loading packages...</p>
        </div>
      ) : filteredPackages.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
          <Package className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">
            No packages found
          </h3>
          <p className="text-green-200">
            Create your first package by clicking "Add New Package" button
            above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {pkg.name}
                    </h3>
                    <p className="text-sm text-green-200 mt-1">
                      {pkg.hospital}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        pkg.status === "active"
                          ? "bg-green-600/30 text-green-300"
                          : "bg-gray-600/30 text-gray-300"
                      }`}
                    >
                      {pkg.status}
                    </span>
                    {pkg.blockchainVerified && (
                      <Shield
                        className="h-4 w-4 text-emerald-400"
                        title="Blockchain Verified"
                      />
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="mt-4 flex items-baseline">
                  <span className="text-2xl font-bold text-white">
                    ₹{pkg.cost.toLocaleString()}
                  </span>
                  <span className="text-xs text-green-300 ml-2">
                    {pkg.currency}
                  </span>
                </div>

                {/* Rating & Savings */}
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-white ml-1">{pkg.rating}</span>
                  <span className="text-xs text-green-300 ml-2">
                    Save {pkg.savings}%
                  </span>
                </div>

                {/* Duration & Slots */}
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-200">
                    <Clock className="h-4 w-4 mr-1" />
                    {pkg.duration}
                  </div>
                  <div className="flex items-center text-green-200">
                    <Users className="h-4 w-4 mr-1" />
                    {pkg.availableSlots} slots left
                  </div>
                </div>

                {/* Includes */}
                <div className="mt-4">
                  <p className="text-xs text-green-300 mb-2">
                    Package includes:
                  </p>
                  <ul className="space-y-1">
                    {pkg.includes.slice(0, 3).map((item, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-white flex items-center"
                      >
                        <CheckCircle className="h-3 w-3 text-emerald-400 mr-2 shrink-0" />
                        <span className="truncate">{item}</span>
                      </li>
                    ))}
                    {pkg.includes.length > 3 && (
                      <li className="text-xs text-green-300">
                        +{pkg.includes.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Doctors */}
                <div className="mt-4">
                  <p className="text-xs text-green-300 mb-2">
                    Assigned Doctors:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {pkg.doctors.map((doctor, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-emerald-600/30 text-emerald-300 rounded-full text-xs"
                      >
                        {doctor}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Blockchain Hash */}
                {pkg.blockchainVerified && (
                  <div className="mt-4 p-2 bg-white/5 rounded-lg">
                    <p className="text-xs text-green-300 break-all">
                      Hash: {pkg.verificationHash.substring(0, 20)}...
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-6 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => setSelectedPackage(pkg)}
                    className="p-2 text-green-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowEditModal(pkg)}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(pkg.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      pkg.status === "active"
                        ? "text-yellow-400 hover:text-yellow-300 hover:bg-white/10"
                        : "text-green-400 hover:text-green-300 hover:bg-white/10"
                    }`}
                    title={pkg.status === "active" ? "Deactivate" : "Activate"}
                  >
                    {pkg.status === "active" ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDeletePackage(pkg.id)}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Package Modal */}
      {showAddModal && (
        <AddPackageModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPackage}
          doctors={doctors}
        />
      )}

      {/* Edit Package Modal */}
      {showEditModal && (
        <EditPackageModal
          package={showEditModal}
          onClose={() => setShowEditModal(null)}
          onSave={handleEditPackage}
          doctors={doctors}
        />
      )}

      {/* View Details Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">
                  Package Details
                </h3>
                <button
                  onClick={() => setSelectedPackage(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              {/* Package details content */}
              <pre className="text-green-200">
                {JSON.stringify(selectedPackage, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageTab;
