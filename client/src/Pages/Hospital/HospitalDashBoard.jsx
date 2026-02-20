import React, { useState } from "react";
import Header from "./Header";
import DashboardStats from "./DashboardStats";
import PackageTab from "./PackageTab";
import RequestTab from "./RequestTab";
import PatientTab from "./PatientTab";
import AppointmentTab from "./AppointmentTab";
import DoctorTab from "./DoctorTab";
import {
  Home, Package, FileText, Users,
  Calendar, Stethoscope
} from 'lucide-react';

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Hospital Info
  const [hospitalInfo] = useState({
    id: 1,
    name: "XYZ Heart Institute",
    location: "Nairobi, Kenya",
    email: "contact@xyzheart.com",
    phone: "+254 700 789 012",
    accreditation: "JCI Accredited",
    verified: true,
    stats: {
      totalPatients: 1250,
      activePatients: 48,
      totalPackages: 15,
      pendingRequests: 12,
      todayAppointments: 8,
      totalDoctors: 25,
      revenue: 4500000,
      occupancyRate: 78
    }
  });

  // Packages Data
  const [packages, setPackages] = useState([
    {
      id: 1,
      name: "Cardiac Bypass Surgery",
      hospital: "XYZ Heart Institute",
      cost: 450000,
      currency: "INR",
      duration: "7-10 days",
      includes: ["Surgery", "5 days ICU", "10 days ward", "Follow-up", "Medications", "Pre-op tests"],
      excludes: ["Airfare", "Visa fees", "Personal expenses"],
      blockchainVerified: true,
      verificationHash: "0x7d8f9e3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
      rating: 4.9,
      savings: 60,
      comparedToUS: "Save 60% vs US",
      status: "active",
      availableSlots: 5,
      doctors: ["Dr. Sarah Johnson", "Dr. Michael Chen"],
      createdAt: "2024-01-15",
      updatedAt: "2024-10-20"
    },
    {
      id: 2,
      name: "Hip Replacement",
      hospital: "XYZ Heart Institute",
      cost: 320000,
      currency: "INR",
      duration: "5-7 days",
      includes: ["Surgery", "Implant", "4 days ward", "Physiotherapy", "Follow-up"],
      excludes: ["Travel", "Accommodation"],
      blockchainVerified: true,
      verificationHash: "0x8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r",
      rating: 4.7,
      savings: 55,
      comparedToUS: "Save 55% vs US",
      status: "active",
      availableSlots: 3,
      doctors: ["Dr. James Wilson", "Dr. Emily Brown"],
      createdAt: "2024-02-10",
      updatedAt: "2024-10-18"
    }
  ]);

  // Package Requests Data
  const [packageRequests, setPackageRequests] = useState([
    {
      id: 1,
      patientId: 101,
      patientName: "Aarav Mehta",
      patientCountry: "India",
      patientEmail: "aarav@email.com",
      patientPhone: "+91 9876543210",
      packageId: 1,
      packageName: "Cardiac Bypass Surgery",
      requestedDate: "2024-10-15",
      preferredDate: "2024-11-10",
      status: "pending",
      medicalHistory: "Hypertension, Diabetes",
      documents: ["Medical Reports", "Insurance Letter"],
      notes: "Requires translator",
      urgency: "medium",
      budget: 500000,
      insurance: "Yes"
    },
    {
      id: 2,
      patientId: 102,
      patientName: "Priya Sharma",
      patientCountry: "India",
      patientEmail: "priya@email.com",
      patientPhone: "+91 9876543211",
      packageId: 2,
      packageName: "Hip Replacement",
      requestedDate: "2024-10-16",
      preferredDate: "2024-11-15",
      status: "approved",
      medicalHistory: "Osteoarthritis",
      documents: ["X-rays", "Medical Reports"],
      notes: "Allergic to penicillin",
      urgency: "low",
      budget: 350000,
      insurance: "Pending"
    }
  ]);

  // Patients Data
  const [patients, setPatients] = useState([
    {
      id: 101,
      name: "Aarav Mehta",
      age: 55,
      gender: "Male",
      bloodGroup: "O+",
      email: "aarav@email.com",
      phone: "+91 9876543210",
      country: "India",
      county: "Mumbai",
      address: "123 Main St, Mumbai",
      passport: "P12345678",
      emergencyContact: "+91 9876543211",
      assignedDoctor: "Dr. Sarah Johnson",
      assignedPackage: "Cardiac Bypass Surgery",
      admissionDate: "2024-11-10",
      status: "scheduled",
      medicalHistory: ["Hypertension", "Diabetes Type 2"]
    },
    {
      id: 102,
      name: "Priya Sharma",
      age: 65,
      gender: "Female",
      bloodGroup: "B+",
      email: "priya@email.com",
      phone: "+91 9876543211",
      country: "India",
      county: "Delhi",
      address: "456 Park Ave, Delhi",
      passport: "P87654321",
      emergencyContact: "+91 9876543212",
      assignedDoctor: "Dr. James Wilson",
      assignedPackage: "Hip Replacement",
      admissionDate: "2024-11-15",
      status: "approved",
      medicalHistory: ["Osteoarthritis"]
    }
  ]);

  // Appointments Data
  const [appointments, setAppointments] = useState([
    {
      id: 201,
      patientId: 101,
      patientName: "Aarav Mehta",
      doctorId: 301,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiac Surgery",
      date: "2024-11-05",
      time: "10:00 AM",
      duration: "45 min",
      type: "Pre-op Consultation",
      status: "scheduled",
      notes: "Review medical history",
      location: "Room 405, Cardiac Wing"
    },
    {
      id: 202,
      patientId: 102,
      patientName: "Priya Sharma",
      doctorId: 302,
      doctorName: "Dr. James Wilson",
      specialty: "Orthopedic Surgery",
      date: "2024-11-06",
      time: "2:30 PM",
      duration: "30 min",
      type: "Surgical Consultation",
      status: "confirmed",
      notes: "Discuss implant options",
      location: "Room 210, Orthopedic Dept"
    },
    {
      id: 203,
      patientId: 103,
      patientName: "Raj Kumar",
      doctorId: 301,
      doctorName: "Dr. Sarah Johnson",
      specialty: "Cardiac Surgery",
      date: "2024-11-07",
      time: "11:15 AM",
      duration: "60 min",
      type: "Pre-op Assessment",
      status: "pending",
      notes: "ECG and blood work",
      location: "Room 405, Cardiac Wing"
    }
  ]);

  // Doctors Data
  const [doctors, setDoctors] = useState([
    {
      id: 301,
      name: "Dr. Sarah Johnson",
      specialty: "Cardiac Surgery",
      experience: "15 years",
      education: "MBBS, MS (Cardiac Surgery) - Harvard Medical School",
      license: "MED-2024-001",
      email: "sarah.j@xyzheart.com",
      phone: "+254 700 789 015",
      available: true,
      consultationFee: 150,
      currency: "USD",
      patients: [101, 103],
      rating: 4.9,
      reviews: 128,
      image: "/api/placeholder/100/100",
      schedule: [
        { day: "Monday", hours: "9:00 AM - 5:00 PM" },
        { day: "Wednesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Friday", hours: "9:00 AM - 3:00 PM" }
      ]
    },
    {
      id: 302,
      name: "Dr. James Wilson",
      specialty: "Orthopedic Surgery",
      experience: "12 years",
      education: "MBBS, MS (Orthopedics) - Johns Hopkins University",
      license: "MED-2024-002",
      email: "james.w@xyzheart.com",
      phone: "+254 700 789 016",
      available: true,
      consultationFee: 120,
      currency: "USD",
      patients: [102],
      rating: 4.8,
      reviews: 95,
      image: "/api/placeholder/100/100",
      schedule: [
        { day: "Tuesday", hours: "9:00 AM - 5:00 PM" },
        { day: "Thursday", hours: "9:00 AM - 5:00 PM" },
        { day: "Saturday", hours: "10:00 AM - 2:00 PM" }
      ]
    },
    {
      id: 303,
      name: "Dr. Emily Brown",
      specialty: "Anesthesiology",
      experience: "10 years",
      education: "MBBS, MD (Anesthesiology) - Oxford University",
      license: "MED-2024-003",
      email: "emily.b@xyzheart.com",
      phone: "+254 700 789 017",
      available: true,
      consultationFee: 100,
      currency: "USD",
      patients: [],
      rating: 4.7,
      reviews: 67,
      image: "/api/placeholder/100/100",
      schedule: [
        { day: "Monday", hours: "8:00 AM - 4:00 PM" },
        { day: "Tuesday", hours: "8:00 AM - 4:00 PM" },
        { day: "Thursday", hours: "8:00 AM - 4:00 PM" }
      ]
    }
  ]);

  // Stats for dashboard
  const stats = {
    totalRequests: packageRequests.length,
    pendingRequests: packageRequests.filter(r => r.status === "pending").length,
    activePatients: patients.filter(p => p.status === "scheduled" || p.status === "admitted").length,
    totalPackages: packages.length,
    totalAppointments: appointments.length,
    todayAppointments: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    totalDoctors: doctors.length,
    availableDoctors: doctors.filter(d => d.available).length
  };

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "packages", label: "Packages", icon: Package },
    { id: "requests", label: "Requests", icon: FileText },
    { id: "patients", label: "Patients", icon: Users },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "doctors", label: "Doctors", icon: Stethoscope }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-green-900">
      {/* Header with integrated tabs - Sidebar removed */}
      <Header 
        hospitalInfo={hospitalInfo}
        activeTab={activeTab}
        tabs={tabs}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area - No left padding since sidebar is removed */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <DashboardStats 
            stats={stats}
            hospitalInfo={hospitalInfo}
            packages={packages}
            requests={packageRequests}
            appointments={appointments}
            patients={patients}
            doctors={doctors}
          />
        )}

        {activeTab === "packages" && (
          <PackageTab 
            packages={packages}
            setPackages={setPackages}
            doctors={doctors}
          />
        )}

        {activeTab === "requests" && (
          <RequestTab 
            requests={packageRequests}
            setRequests={setPackageRequests}
            patients={patients}
            packages={packages}
          />
        )}

        {activeTab === "patients" && (
          <PatientTab 
            patients={patients}
            setPatients={setPatients}
            doctors={doctors}
            packages={packages}
          />
        )}

        {activeTab === "appointments" && (
          <AppointmentTab 
            appointments={appointments}
            setAppointments={setAppointments}
            patients={patients}
            doctors={doctors}
          />
        )}

        {activeTab === "doctors" && (
          <DoctorTab 
            doctors={doctors}
            setDoctors={setDoctors}
            patients={patients}
          />
        )}
      </main>
    </div>
  );
};

export default HospitalDashboard;