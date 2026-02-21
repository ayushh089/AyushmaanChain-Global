import React from "react";
import { User, Hospital, Package, Activity, FileText } from "lucide-react";

const OverviewTab = ({ profile, records, surgeryPackages, rehabReferrals, setActiveTab }) => (
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

export default OverviewTab;