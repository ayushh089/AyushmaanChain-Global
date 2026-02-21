import React from "react";
import { Menu, LogOut, Copy, Check, User, Hospital, Package, Activity, Upload, FileText } from "lucide-react";

const Header = ({ setSidebarOpen, user, copied, handleCopy, handleLogout, activeTab, setActiveTab, tabs }) => {
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
    <header className="bg-white/10 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mr-4 text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <span className="text-xl font-bold text-white tracking-wide">
              AyushmaanChain
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Wallet Address */}
            <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <span className="text-sm text-white font-medium">
                {user?.wallet_address?.slice(0, 6)}...
                {user?.wallet_address?.slice(-4)}
              </span>
              <button
                onClick={handleCopy}
                className="text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/20"
                title={copied ? "Copied!" : "Copy address"}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-green-200 capitalize font-medium">
                  {user?.role}
                </p>
                <p className="text-sm font-semibold text-white">
                  {user?.name}
                </p>
              </div>

              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=ffffff&color=2563eb&length=1&unique=${user?.wallet_address}`}
                  alt="Avatar"
                  className="rounded-full w-10 h-10 border-2 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center space-x-2 bg-white/10 hover:bg-red-500/20 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 border border-white/20"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Desktop */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 overflow-x-auto mt-2">
          {tabs.map((tab) => {
            const Icon = getIcon(tab.icon);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-green-100 hover:bg-white/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Header;