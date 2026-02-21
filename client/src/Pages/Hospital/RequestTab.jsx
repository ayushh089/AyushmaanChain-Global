import React, { useState, useEffect } from "react";
import {
  FileText, Search, Filter, Eye,
  CheckCircle, XCircle, Clock,
  User, Package, Calendar, DollarSign,
  Download, Mail, Phone, MapPin,
  Loader, Shield, AlertCircle
} from 'lucide-react';
import useServiceRequestRegistry from "../../hooks/useServiceRequestRegistry";
import { useAuth } from "../../context/AuthContext";

const RequestTab = () => {
  const { contract, account } = useServiceRequestRegistry();
  const { user } = useAuth();
  
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Fetch hospital requests from blockchain
  const fetchRequests = async () => {
    if (!contract || !account) return;

    try {
      setLoading(true);
      console.log("Fetching requests for hospital:", account);

      // Get all request IDs for this hospital
      const requestIds = await contract.getHospitalRequests(account);
      console.log("Request IDs:", requestIds);

      // Fetch details for each request
      const requestDetails = [];
      for (const id of requestIds) {
        try {
          const req = await contract.getRequest(id);
          
          // Parse metadata
          let patientMetadata = {};
          let insuranceMetadata = {};
          
          try {
            patientMetadata = JSON.parse(req.patientMetadataHash);
          } catch (e) {
            patientMetadata = { fullName: "Unknown", email: "", phone: "" };
          }
          
          try {
            insuranceMetadata = JSON.parse(req.insuranceMetadataHash);
          } catch (e) {
            insuranceMetadata = { provider: "Not specified", policyNumber: "" };
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

          requestDetails.push({
            id: req.requestId,
            requestId: req.requestId,
            patientAddress: req.patient,
            patientName: patientMetadata.fullName || `Patient ${req.patient.substring(0, 6)}...`,
            patientEmail: patientMetadata.email || "Not provided",
            patientPhone: patientMetadata.phone || "Not provided",
            patientAge: patientMetadata.age || "N/A",
            patientBloodGroup: patientMetadata.bloodGroup || "N/A",
            medicalHistory: patientMetadata.medicalHistory || "No history provided",
            notes: patientMetadata.additionalNotes || "",
            preferredDate: patientMetadata.preferredDate || "Not specified",
            
            packageId: req.packageId,
            packageName: `Package ${req.packageId.substring(0, 8)}...`,
            
            insuranceProvider: insuranceMetadata.provider || "Not specified",
            insuranceNumber: insuranceMetadata.policyNumber || "Not specified",
            
            status: statusMap[req.status] || "UNKNOWN",
            statusCode: req.status,
            
            createdAt: new Date(Number(req.createdAt) * 1000).toLocaleString(),
            updatedAt: new Date(Number(req.updatedAt) * 1000).toLocaleString(),
            
            documents: ["Medical Reports", "ID Proof"] // Default documents
          });
        } catch (err) {
          console.error(`Error fetching request ${id}:`, err);
        }
      }

      console.log("Fetched requests:", requestDetails);
      setRequests(requestDetails);

    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load requests on mount
  useEffect(() => {
    fetchRequests();
  }, [contract, account]);

  // Handle approve
  const handleApprove = async (requestId) => {
    if (!contract) return;
    
    setProcessingId(requestId);
    try {
      console.log("Approving request:", requestId);
      const tx = await contract.approveService(requestId);
      await tx.wait();
      
      // Refresh list
      await fetchRequests();
      
    } catch (error) {
      console.error("Error approving request:", error);
      alert("Failed to approve request");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle reject
  const handleReject = async (requestId) => {
    if (!contract) return;
    
    setProcessingId(requestId);
    try {
      console.log("Rejecting request:", requestId);
      const tx = await contract.rejectService(requestId);
      await tx.wait();
      
      await fetchRequests();
      
    } catch (error) {
      console.error("Error rejecting request:", error);
      alert("Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  // Handle complete
  const handleComplete = async (requestId) => {
    if (!contract) return;
    
    setProcessingId(requestId);
    try {
      const treatmentHash = `TREAT-${Date.now()}`;
      console.log("Completing request:", requestId);
      const tx = await contract.completeService(requestId, treatmentHash);
      await tx.wait();
      
      await fetchRequests();
      
    } catch (error) {
      console.error("Error completing request:", error);
      alert("Failed to complete request");
    } finally {
      setProcessingId(null);
    }
  };

  // Filter requests
  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.packageId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || req.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'REQUESTED': return 'bg-yellow-600/30 text-yellow-300';
      case 'APPROVED': return 'bg-green-600/30 text-green-300';
      case 'REJECTED': return 'bg-red-600/30 text-red-300';
      case 'INSURANCE_PENDING': return 'bg-blue-600/30 text-blue-300';
      case 'INSURANCE_APPROVED': return 'bg-purple-600/30 text-purple-300';
      case 'COMPLETED': return 'bg-emerald-600/30 text-emerald-300';
      default: return 'bg-gray-600/30 text-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
        <Loader className="h-12 w-12 animate-spin text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl text-white mb-2">Loading Requests</h3>
        <p className="text-green-200">Fetching service requests from blockchain...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <FileText className="h-5 w-5 mr-2 text-emerald-400" />
              Service Requests
            </h2>
            <p className="text-sm text-green-200 mt-1">
              Manage patient service requests on blockchain
            </p>
            {account && (
              <p className="text-xs text-emerald-300 mt-2">
                Hospital: {account.substring(0, 6)}...{account.substring(38)}
              </p>
            )}
          </div>
          <button
            onClick={fetchRequests}
            className="mt-4 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Loader className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-green-300">Total Requests</p>
            <p className="text-2xl font-bold text-white">{requests.length}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-green-300">Pending</p>
            <p className="text-2xl font-bold text-white">
              {requests.filter(r => r.status === 'REQUESTED').length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-green-300">Approved</p>
            <p className="text-2xl font-bold text-white">
              {requests.filter(r => r.status === 'APPROVED').length}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-sm text-green-300">Completed</p>
            <p className="text-2xl font-bold text-white">
              {requests.filter(r => r.status === 'COMPLETED').length}
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-300" />
            <input
              type="text"
              placeholder="Search by patient name or package ID..."
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
            <option value="all">All Status</option>
            <option value="REQUESTED">Requested</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="INSURANCE_PENDING">Insurance Pending</option>
            <option value="INSURANCE_APPROVED">Insurance Approved</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Requests List */}
      {requests.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-12 text-center">
          <FileText className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-white mb-2">No Requests Found</h3>
          <p className="text-green-200">
            No service requests have been submitted to your hospital yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="lg:col-span-2 space-y-4">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{request.patientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    
                    <p className="text-sm text-green-200 mt-1">
                      Package: {request.packageId.substring(0, 10)}...
                    </p>
                    
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-green-300">Requested</p>
                        <p className="text-sm text-white">{new Date(request.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Preferred</p>
                        <p className="text-sm text-white">{request.preferredDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Blood Group</p>
                        <p className="text-sm text-white">{request.patientBloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Age</p>
                        <p className="text-sm text-white">{request.patientAge}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center space-x-4">
                      <div className="flex items-center text-sm text-green-200">
                        <Mail className="h-4 w-4 mr-1" />
                        {request.patientEmail}
                      </div>
                      <div className="flex items-center text-sm text-green-200">
                        <Phone className="h-4 w-4 mr-1" />
                        {request.patientPhone}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center text-xs text-emerald-300">
                      <Shield className="h-3 w-3 mr-1" />
                      Request ID: {request.requestId.substring(0, 16)}...
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex items-center justify-end space-x-2">
                  {request.status === 'REQUESTED' && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApprove(request.requestId);
                        }}
                        disabled={processingId === request.requestId}
                        className="p-2 text-green-400 hover:text-green-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Approve"
                      >
                        {processingId === request.requestId ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(request.requestId);
                        }}
                        disabled={processingId === request.requestId}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Reject"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  
                  {request.status === 'INSURANCE_APPROVED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleComplete(request.requestId);
                      }}
                      disabled={processingId === request.requestId}
                      className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                      title="Complete Treatment"
                    >
                      {processingId === request.requestId ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <CheckCircle className="h-5 w-5" />
                      )}
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRequest(request);
                    }}
                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-white/10 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
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
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>

                  {/* Patient Info */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium mb-2">Patient Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-green-300">Address</p>
                        <p className="text-white text-xs break-all">{selectedRequest.patientAddress}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Name</p>
                        <p className="text-white">{selectedRequest.patientName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Email</p>
                        <p className="text-white">{selectedRequest.patientEmail}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Phone</p>
                        <p className="text-white">{selectedRequest.patientPhone}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Blood Group</p>
                        <p className="text-white">{selectedRequest.patientBloodGroup}</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-300">Age</p>
                        <p className="text-white">{selectedRequest.patientAge}</p>
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium mb-2">Medical History</h4>
                    <p className="text-white text-sm">{selectedRequest.medicalHistory}</p>
                  </div>

                  {/* Package Info */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium mb-2">Package</h4>
                    <p className="text-white text-sm break-all">ID: {selectedRequest.packageId}</p>
                    <p className="text-xs text-green-300 mt-1">Preferred Date: {selectedRequest.preferredDate}</p>
                  </div>

                  {/* Insurance */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium mb-2">Insurance</h4>
                    <p className="text-white text-sm">Provider: {selectedRequest.insuranceProvider}</p>
                    <p className="text-white text-sm">Policy: {selectedRequest.insuranceNumber}</p>
                  </div>

                  {/* Notes */}
                  {selectedRequest.notes && (
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Additional Notes</h4>
                      <p className="text-white text-sm">{selectedRequest.notes}</p>
                    </div>
                  )}

                  {/* Timestamps */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-white font-medium mb-2">Timeline</h4>
                    <p className="text-xs text-green-300">Created: {selectedRequest.createdAt}</p>
                    <p className="text-xs text-green-300">Updated: {selectedRequest.updatedAt}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-x-2">
                    {selectedRequest.status === 'REQUESTED' && (
                      <>
                        <button
                          onClick={() => handleApprove(selectedRequest.requestId)}
                          disabled={processingId === selectedRequest.requestId}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {processingId === selectedRequest.requestId ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(selectedRequest.requestId)}
                          disabled={processingId === selectedRequest.requestId}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    
                    {selectedRequest.status === 'INSURANCE_APPROVED' && (
                      <button
                        onClick={() => handleComplete(selectedRequest.requestId)}
                        disabled={processingId === selectedRequest.requestId}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {processingId === selectedRequest.requestId ? 'Processing...' : 'Complete Treatment'}
                      </button>
                    )}
                  </div>

                  {/* Request ID */}
                  <div className="pt-2">
                    <p className="text-xs text-emerald-300 break-all">
                      <span className="font-medium">Request ID:</span> {selectedRequest.requestId}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-6 text-center">
                <FileText className="h-12 w-12 text-green-300 mx-auto mb-3" />
                <p className="text-white">Select a request to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTab;