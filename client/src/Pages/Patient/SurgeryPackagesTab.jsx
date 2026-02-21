import React, { useState, useEffect } from "react";
import { 
  Package, Shield, Star, CheckCircle, Loader, Send, 
  X, Calendar, FileText, User, Phone, MapPin, Heart,
  Clock, AlertCircle, Eye, Filter
} from "lucide-react";
import useHospitalPackageRegistry from "../../hooks/useHospitalPackageRegistry";
import useServiceRequestRegistry from "../../hooks/useServiceRequestRegistry";
import { useAuth } from "../../context/AuthContext";

const SurgeryPackagesTab = () => {
  const { contract: packageContract, account } = useHospitalPackageRegistry();
  const { contract: requestContract } = useServiceRequestRegistry();
  const { user } = useAuth();
  
  const [packages, setPackages] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [applying, setApplying] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showMyRequests, setShowMyRequests] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    bloodGroup: "",
    medicalHistory: "",
    preferredDate: "",
    additionalNotes: "",
    insuranceProvider: "",
    insuranceNumber: ""
  });

  // Fetch all packages from blockchain
  const fetchAllPackages = async () => {
    if (!packageContract) return;

    try {
      setLoading(true);
      console.log("Fetching all packages from blockchain...");

      const packageIds = await packageContract.getAllPackages();
      console.log("Package IDs:", packageIds);

      const packageDetails = [];
      for (const id of packageIds) {
        try {
          const pkg = await packageContract.getPackage(id);
          
          let metadata = {};
          try {
            metadata = JSON.parse(pkg.metadataHash);
          } catch (e) {
            metadata = {
              duration: "Not specified",
              includes: [],
              excludes: []
            };
          }

          const includes = metadata.includes 
            ? (Array.isArray(metadata.includes) ? metadata.includes : metadata.includes.split('\n').filter(i => i.trim()))
            : ["Surgery", "Hospital Stay", "Doctor Consultation"];
          
          const excludes = metadata.excludes
            ? (Array.isArray(metadata.excludes) ? metadata.excludes : metadata.excludes.split('\n').filter(e => e.trim()))
            : ["Travel Expenses", "Visa Fees"];

          packageDetails.push({
            id: pkg.packageId,
            packageId: pkg.packageId,
            name: pkg.name,
            hospital: pkg.hospital,
            hospitalDisplay: `0x${pkg.hospital.substring(2, 6)}...${pkg.hospital.substring(38)}`,
            cost: Number(pkg.price),
            currency: "INR",
            duration: metadata.duration || "7-10 days",
            includes: includes,
            excludes: excludes,
            blockchainVerified: true,
            verificationHash: pkg.packageId,
            rating: 4.5,
            savings: 60,
            comparedToUS: "Save 60% vs US",
            timestamp: new Date(Number(pkg.timestamp) * 1000).toLocaleDateString(),
            metadataHash: pkg.metadataHash
          });
        } catch (err) {
          console.error(`Error fetching package ${id}:`, err);
        }
      }

      setPackages(packageDetails);
    } catch (error) {
      console.error("Error fetching packages:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch patient's requests from blockchain
  const fetchMyRequests = async () => {
    if (!requestContract || !account) return;

    try {
      setLoadingRequests(true);
      console.log("Fetching patient requests from blockchain...");

      // Get all request IDs for this patient
      const requestIds = await requestContract.getPatientRequests(account);
      console.log("My Request IDs:", requestIds);

      // Fetch details for each request
      const requestDetails = [];
      for (const id of requestIds) {
        try {
          const req = await requestContract.getRequest(id);
          
          // Parse metadata
          let patientMetadata = {};
          let insuranceMetadata = {};
          
          try {
            patientMetadata = JSON.parse(req.patientMetadataHash);
          } catch (e) {
            patientMetadata = {};
          }
          
          try {
            insuranceMetadata = JSON.parse(req.insuranceMetadataHash);
          } catch (e) {
            insuranceMetadata = {};
          }

          // Map status enum to string
          const statusMap = [
            "REQUESTED",
            "APPROVED", 
            "REJECTED",
            "INSURANCE_PENDING",
            "INSURANCE_APPROVED",
            "COMPLETED"
          ];

          // Get package details
          let packageName = "Unknown Package";
          try {
            const pkg = await packageContract.getPackage(req.packageId);
            packageName = pkg.name;
          } catch (e) {
            console.log("Could not fetch package details");
          }

          requestDetails.push({
            id: req.requestId,
            requestId: req.requestId,
            packageId: req.packageId,
            packageName: packageName,
            hospital: req.hospital,
            hospitalDisplay: `0x${req.hospital.substring(2, 6)}...${req.hospital.substring(38)}`,
            status: statusMap[req.status] || "UNKNOWN",
            statusCode: req.status,
            createdAt: new Date(Number(req.createdAt) * 1000).toLocaleString(),
            updatedAt: new Date(Number(req.updatedAt) * 1000).toLocaleString(),
            patientMetadata: patientMetadata,
            insuranceMetadata: insuranceMetadata
          });
        } catch (err) {
          console.error(`Error fetching request ${id}:`, err);
        }
      }

      console.log("Fetched my requests:", requestDetails);
      setMyRequests(requestDetails);

    } catch (error) {
      console.error("Error fetching patient requests:", error);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Load packages on mount
  useEffect(() => {
    fetchAllPackages();
  }, [packageContract]);

  // Load patient requests when account changes
  useEffect(() => {
    if (account) {
      fetchMyRequests();
    }
  }, [requestContract, account]);

  // Handle apply button click - show form
  const handleApplyClick = (pkg) => {
    setSelectedPackage(pkg);
    setShowForm(true);
    
    // Pre-fill with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  };

  // Handle form submit - create blockchain request
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (!requestContract || !selectedPackage) {
      alert("Contract not ready");
      return;
    }

    setApplying(selectedPackage.id);

    try {
      // Generate unique request ID
      const requestId = `REQ-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

      // Create patient metadata
      const patientMetadata = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        age: formData.age,
        bloodGroup: formData.bloodGroup,
        medicalHistory: formData.medicalHistory,
        preferredDate: formData.preferredDate,
        additionalNotes: formData.additionalNotes,
        requestedAt: new Date().toISOString()
      };

      // Create insurance metadata
      const insuranceMetadata = {
        provider: formData.insuranceProvider,
        policyNumber: formData.insuranceNumber,
        status: "PENDING"
      };

      // Convert to JSON strings
      const patientMetadataHash = JSON.stringify(patientMetadata);
      const insuranceMetadataHash = JSON.stringify(insuranceMetadata);

      console.log("Creating service request:", {
        requestId,
        hospital: selectedPackage.hospital,
        packageId: selectedPackage.packageId
      });

      // Call blockchain contract
      const tx = await requestContract.createServiceRequest(
        requestId,
        selectedPackage.hospital,
        selectedPackage.packageId,
        patientMetadataHash,
        insuranceMetadataHash
      );

      console.log("Transaction sent:", tx.hash);
      
      // Wait for confirmation
      await tx.wait();
      
      console.log("Transaction confirmed");

      // Show success message
      alert(`✓ Request Submitted Successfully!\n\nYour request ID: ${requestId}\n\nYou will be contacted by the hospital shortly.`);

      // Close form and reset
      setShowForm(false);
      setSelectedPackage(null);
      setFormData({
        fullName: "", email: "", phone: "", age: "", bloodGroup: "",
        medicalHistory: "", preferredDate: "", additionalNotes: "",
        insuranceProvider: "", insuranceNumber: ""
      });

      // Refresh my requests
      await fetchMyRequests();

    } catch (error) {
      console.error("Error creating request:", error);
      alert("Failed to submit request: " + (error.message || "Please try again"));
    } finally {
      setApplying(null);
    }
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch(status) {
      case 'REQUESTED':
        return { color: 'bg-yellow-600/30 text-yellow-300', icon: Clock, text: 'Pending Review' };
      case 'APPROVED':
        return { color: 'bg-green-600/30 text-green-300', icon: CheckCircle, text: 'Approved' };
      case 'REJECTED':
        return { color: 'bg-red-600/30 text-red-300', icon: XCircle, text: 'Rejected' };
      case 'INSURANCE_PENDING':
        return { color: 'bg-blue-600/30 text-blue-300', icon: Clock, text: 'Insurance Pending' };
      case 'INSURANCE_APPROVED':
        return { color: 'bg-purple-600/30 text-purple-300', icon: Shield, text: 'Insurance Approved' };
      case 'COMPLETED':
        return { color: 'bg-emerald-600/30 text-emerald-300', icon: CheckCircle, text: 'Completed' };
      default:
        return { color: 'bg-gray-600/30 text-gray-300', icon: AlertCircle, text: status };
    }
  };

  // Filter requests
  const filteredRequests = myRequests.filter(req => 
    filterStatus === "all" || req.status === filterStatus
  );

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
        <Loader className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">Loading Packages</h3>
        <p className="text-green-200">Fetching surgery packages from blockchain...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Toggle */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              {showMyRequests ? (
                <FileText className="h-5 w-5 mr-2 text-emerald-400" />
              ) : (
                <Package className="h-5 w-5 mr-2 text-emerald-400" />
              )}
              {showMyRequests ? "My Requests" : "Surgery Packages"}
            </h2>
            <p className="text-sm text-green-200 mt-1">
              {showMyRequests 
                ? "Track your submitted service requests" 
                : "Browse and apply for blockchain-verified surgery packages"}
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0 flex gap-2">
            <button
              onClick={() => {
                setShowMyRequests(!showMyRequests);
                setSelectedRequest(null);
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {showMyRequests ? (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  View Packages
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  My Requests ({myRequests.length})
                </>
              )}
            </button>
            
            {!showMyRequests && (
              <button
                onClick={fetchAllPackages}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Loader className="h-4 w-4 mr-2" />
                Refresh
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {!showMyRequests ? (
            // Package Stats
            <>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Total Packages</p>
                <p className="text-2xl font-bold text-white">{packages.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Blockchain Verified</p>
                <p className="text-2xl font-bold text-white">{packages.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Hospitals</p>
                <p className="text-2xl font-bold text-white">
                  {new Set(packages.map(p => p.hospital)).size}
                </p>
              </div>
            </>
          ) : (
            // Request Stats
            <>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Total Requests</p>
                <p className="text-2xl font-bold text-white">{myRequests.length}</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Pending</p>
                <p className="text-2xl font-bold text-white">
                  {myRequests.filter(r => r.status === 'REQUESTED').length}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-green-300">Approved</p>
                <p className="text-2xl font-bold text-white">
                  {myRequests.filter(r => r.status === 'APPROVED' || r.status === 'INSURANCE_APPROVED').length}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Filter for My Requests */}
        {showMyRequests && myRequests.length > 0 && (
          <div className="mt-4 flex items-center gap-2">
            <Filter className="h-4 w-4 text-green-300" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="REQUESTED">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="INSURANCE_PENDING">Insurance Pending</option>
              <option value="INSURANCE_APPROVED">Insurance Approved</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        )}
      </div>

      {/* My Requests View */}
      {showMyRequests ? (
        loadingRequests ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
            <Loader className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">Loading Your Requests</h3>
            <p className="text-green-200">Fetching your service requests from blockchain...</p>
          </div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
            <FileText className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Requests Found</h3>
            <p className="text-green-200 mb-6">
              You haven't submitted any service requests yet.
            </p>
            <button
              onClick={() => setShowMyRequests(false)}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Browse Packages
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requests List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredRequests.map((req) => {
                const statusInfo = getStatusInfo(req.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <div
                    key={req.id}
                    className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold text-white">
                            {req.packageName}
                          </h3>
                          <div className={`flex items-center px-3 py-1 rounded-full text-xs ${statusInfo.color}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusInfo.text}
                          </div>
                        </div>
                        
                        <p className="text-sm text-green-200 mt-1">
                          Hospital: {req.hospitalDisplay}
                        </p>
                        
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-green-300">Requested</p>
                            <p className="text-sm text-white">{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-300">Package ID</p>
                            <p className="text-sm text-white">{req.packageId.substring(0, 8)}...</p>
                          </div>
                          <div>
                            <p className="text-xs text-green-300">Updated</p>
                            <p className="text-sm text-white">{new Date(req.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        {req.patientMetadata.preferredDate && (
                          <div className="mt-2 flex items-center text-sm text-green-200">
                            <Calendar className="h-4 w-4 mr-1" />
                            Preferred: {req.patientMetadata.preferredDate}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Details Button */}
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Request Details */}
            <div className="lg:col-span-1">
              {selectedRequest ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 sticky top-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Request Details</h3>
                  
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-300">Status</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusInfo(selectedRequest.status).color}`}>
                        {selectedRequest.status}
                      </span>
                    </div>

                    {/* Package Info */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Package</h4>
                      <p className="text-white">{selectedRequest.packageName}</p>
                      <p className="text-xs text-green-300 break-all mt-1">ID: {selectedRequest.packageId}</p>
                    </div>

                    {/* Hospital */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Hospital</h4>
                      <p className="text-white break-all">{selectedRequest.hospital}</p>
                    </div>

                    {/* Patient Info */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Your Information</h4>
                      <div className="space-y-2">
                        <p className="text-sm text-white">Name: {selectedRequest.patientMetadata.fullName}</p>
                        <p className="text-sm text-white">Email: {selectedRequest.patientMetadata.email}</p>
                        <p className="text-sm text-white">Phone: {selectedRequest.patientMetadata.phone}</p>
                        {selectedRequest.patientMetadata.bloodGroup && (
                          <p className="text-sm text-white">Blood Group: {selectedRequest.patientMetadata.bloodGroup}</p>
                        )}
                        {selectedRequest.patientMetadata.age && (
                          <p className="text-sm text-white">Age: {selectedRequest.patientMetadata.age}</p>
                        )}
                      </div>
                    </div>

                    {/* Medical History */}
                    {selectedRequest.patientMetadata.medicalHistory && (
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-white font-medium mb-2">Medical History</h4>
                        <p className="text-white text-sm">{selectedRequest.patientMetadata.medicalHistory}</p>
                      </div>
                    )}

                    {/* Insurance */}
                    {(selectedRequest.insuranceMetadata.provider || selectedRequest.insuranceMetadata.policyNumber) && (
                      <div className="border-t border-white/10 pt-4">
                        <h4 className="text-white font-medium mb-2">Insurance</h4>
                        {selectedRequest.insuranceMetadata.provider && (
                          <p className="text-sm text-white">Provider: {selectedRequest.insuranceMetadata.provider}</p>
                        )}
                        {selectedRequest.insuranceMetadata.policyNumber && (
                          <p className="text-sm text-white">Policy: {selectedRequest.insuranceMetadata.policyNumber}</p>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Timeline</h4>
                      <p className="text-xs text-green-300">Created: {selectedRequest.createdAt}</p>
                      <p className="text-xs text-green-300">Updated: {selectedRequest.updatedAt}</p>
                    </div>

                    {/* Request ID */}
                    <div className="border-t border-white/10 pt-4">
                      <p className="text-xs text-emerald-300 break-all">
                        <span className="font-medium">Request ID:</span> {selectedRequest.requestId}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
                  <Eye className="h-12 w-12 text-green-300 mx-auto mb-3" />
                  <p className="text-white">Select a request to view details</p>
                </div>
              )}
            </div>
          </div>
        )
      ) : (
        /* Packages Grid View */
        packages.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
            <Package className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">No Packages Available</h3>
            <p className="text-green-200">
              There are no surgery packages on the blockchain yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden hover:bg-white/15 transition-all"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-white">{pkg.name}</h3>
                    {pkg.blockchainVerified && (
                      <div className="flex items-center bg-emerald-600/30 px-2 py-1 rounded-full">
                        <Shield className="h-3 w-3 text-emerald-400 mr-1" />
                        <span className="text-xs text-emerald-300">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Hospital Info */}
                  <p className="text-sm text-green-200 mt-1 flex items-center">
                    <span className="truncate">{pkg.hospitalDisplay}</span>
                  </p>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline">
                    <span className="text-2xl font-bold text-white">
                      ₹{formatPrice(pkg.cost)}
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
                      {pkg.comparedToUS}
                    </span>
                  </div>

                  {/* Package Includes */}
                  <div className="mt-4">
                    <p className="text-xs text-green-300 mb-2">Package includes:</p>
                    <ul className="space-y-1">
                      {pkg.includes.slice(0, 3).map((item, idx) => (
                        <li key={idx} className="text-sm text-white flex items-start">
                          <CheckCircle className="h-3 w-3 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                          <span className="text-xs">{item}</span>
                        </li>
                      ))}
                      {pkg.includes.length > 3 && (
                        <li className="text-xs text-green-300 ml-5">
                          +{pkg.includes.length - 3} more items
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Duration */}
                  <div className="mt-4">
                    <p className="text-xs text-green-300">Duration: {pkg.duration}</p>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApplyClick(pkg)}
                    className="w-full mt-4 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Application Form Modal */}
      {showForm && selectedPackage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Apply for Package</h3>
                  <p className="text-sm text-emerald-300 mt-1">{selectedPackage.name}</p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Package Summary */}
              <div className="bg-emerald-900/30 rounded-lg p-4 mb-6 border border-emerald-500/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-green-300">Package Price</p>
                    <p className="text-xl font-bold text-white">
                      ₹{formatPrice(selectedPackage.cost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-green-300">Duration</p>
                    <p className="text-white">{selectedPackage.duration}</p>
                  </div>
                  <Shield className="h-8 w-8 text-emerald-400" />
                </div>
              </div>

              {/* Application Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Personal Info */}
                  <div className="md:col-span-2">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <User className="h-4 w-4 text-emerald-400 mr-2" />
                      Personal Information
                    </h4>
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Blood Group</label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  {/* Medical Info */}
                  <div className="md:col-span-2 mt-2">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Heart className="h-4 w-4 text-emerald-400 mr-2" />
                      Medical Information
                    </h4>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-green-300 mb-1">Medical History</label>
                    <textarea
                      rows="3"
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="List any existing conditions, allergies, or medications..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm text-green-300 mb-1">Additional Notes</label>
                    <textarea
                      rows="2"
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({...formData, additionalNotes: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>

                  {/* Insurance Info */}
                  <div className="md:col-span-2 mt-2">
                    <h4 className="text-white font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 text-emerald-400 mr-2" />
                      Insurance Information
                    </h4>
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Insurance Provider</label>
                    <input
                      type="text"
                      value={formData.insuranceProvider}
                      onChange={(e) => setFormData({...formData, insuranceProvider: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-green-300 mb-1">Policy Number</label>
                    <input
                      type="text"
                      value={formData.insuranceNumber}
                      onChange={(e) => setFormData({...formData, insuranceNumber: e.target.value})}
                      className="w-full bg-gray-700 border border-white/10 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="bg-emerald-900/30 rounded-lg p-3 border border-emerald-500/30 mt-4">
                  <p className="text-xs text-green-300 flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    Your request will be stored on blockchain with ID: REQ-{Date.now().toString().slice(-8)}...
                  </p>
                </div>

                {/* Form Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying === selectedPackage.id}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {applying === selectedPackage.id ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurgeryPackagesTab;