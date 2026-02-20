// src/Pages/Hospital/Header.jsx
import React from "react";
import { Bell, User, ChevronDown } from 'lucide-react';

const Header = ({ hospitalInfo, activeTab, tabs, setActiveTab }) => {
  return (
    <header className="bg-white/10 backdrop-blur-md border-b border-white/10 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Hospital Name */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-white">{hospitalInfo.name}</h1>
                <p className="text-xs text-emerald-300">{hospitalInfo.accreditation}</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/5 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white shadow-lg'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.id === "requests" && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <button className="relative text-green-200 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">Admin</p>
                <p className="text-xs text-green-300">{hospitalInfo.location}</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <ChevronDown className="h-4 w-4 text-green-200 hidden sm:block" />
            </div>
          </div>
        </div>

        {/* Mobile Tab Navigation - Scrollable */}
        <div className="lg:hidden overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex space-x-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-green-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                  {tab.id === "requests" && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 rounded-full">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;