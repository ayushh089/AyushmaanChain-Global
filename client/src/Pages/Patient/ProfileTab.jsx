import React, { useState } from "react";
import { User, Globe } from "lucide-react";

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

export default ProfileTab;