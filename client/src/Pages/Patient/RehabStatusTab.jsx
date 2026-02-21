import React from "react";
import { Activity, User, Phone } from "lucide-react";

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

export default RehabStatusTab;