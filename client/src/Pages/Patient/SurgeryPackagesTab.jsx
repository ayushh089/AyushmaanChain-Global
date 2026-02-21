import React from "react";
import { Package, Shield, Star, CheckCircle } from "lucide-react";

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

export default SurgeryPackagesTab;