import React from "react";
import { Hospital, MapPin, Star, Shield } from "lucide-react";

const ExploreHospitalsTab = ({
  hospitals,
  selectedHospital,
  setSelectedHospital,
}) => {
  console.log(hospitals);
  

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

export default ExploreHospitalsTab;