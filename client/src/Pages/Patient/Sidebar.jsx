import React from "react";
import { X, User, Hospital, Package, Activity, Upload, FileText } from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen, activeTab, setActiveTab, tabs }) => {
  const getIcon = (iconName) => {
    switch(iconName) {
      case "User": return User;
      case "Hospital": return Hospital;
      case "Package": return Package;
      case "Activity": return Activity;
      case "Upload": return Upload;
      case "FileText": return FileText;
      default: return User;
    }
  };

  return (
    <>
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
            {tabs.map((item) => {
              const Icon = getIcon(item.icon);
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
    </>
  );
};

export default Sidebar;