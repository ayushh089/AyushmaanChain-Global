import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Copy, Check, Home, FileText, UserPlus, UserMinus, Users, Calendar, Pill, Shield, Package, Stethoscope, FlaskConical, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, setUser } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleCopy = () => {
    if (user?.wallet_address) {
      navigator.clipboard.writeText(user.wallet_address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Define navigation links for different user roles
  const getNavLinks = () => {
    if (!user) return [];

    const baseLinks = [
      // { to: "/homepage", label: "Dashboard", icon: Home }
    ];

    switch (user.role) {
      case "patient":
        return [
          ...baseLinks,
          { to: "/patient/dashboard", label: "My Health", icon: FileText },
          { to: "/patient/medical-records", label: "Medical Records", icon: FileText },
          { to: "/patient/grant-access", label: "Grant Access", icon: UserPlus },
          { to: "/patient/revoke-access", label: "Revoke Access", icon: UserMinus },
          { to: "/patient/my-doctors", label: "My Doctors", icon: Stethoscope },
          { to: "/patient/prescription", label: "Prescriptions", icon: Pill }
        ];
      
      case "doctor":
        return [
          ...baseLinks,
          { to: "/doctor/patient-manager", label: "Patient Manager", icon: Users }
        ];
      
      case "pharmacist":
        return [
          ...baseLinks,
          { to: "/pharmacist/verify", label: "Verify Prescription", icon: Shield },
          { to: "/pharmacist/dispensed", label: "Dispensed Medicines", icon: Package }
        ];
      
      case "admin":
        return [
          ...baseLinks,
          { to: "/admin/assign-role", label: "Assign Roles", icon: Shield }
        ];
      
      case "manufacturer":
        return [
          { to: "/manufacturer/create-drug", label: "Create Drug", icon: FlaskConical },
          { to: "/manufacturer/drug-inventory", label: "Drug Inventory", icon: Package },
          // { to: "/manufacturer/verify-drug", label: "Verify Drug", icon: Shield }
        ];
      
      default:
        return baseLinks;
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="mx-4 mt-4 mb-6    rounded-xl  ">
      {/* Main Navbar */}
      <nav className="bg-gradient-to-r ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to={user ? "/homepage" : "/"} 
              className="flex items-center space-x-3 hover:opacity-90 transition-all duration-300 transform hover:scale-105"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6 text-green-600" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-wide">AyushmaanChain</span>
            </Link>

            {/* User Section */}
            {user ? (
              <div className="flex items-center space-x-4">
                {/* Wallet Address */}
                <div className="hidden md:flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <span className="text-sm text-white font-medium">
                    {user.wallet_address.slice(0, 6)}...{user.wallet_address.slice(-4)}
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
                    <p className="text-xs text-green-200 capitalize font-medium">{user.role}</p>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.name}&background=ffffff&color=2563eb&length=1&unique=${user.wallet_address}`}
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
            ) : (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login" 
                  className="text-white hover:bg-white/10 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-md border border-white/20"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Navigation Links */}
      {user && navLinks.length > 0 && (
        <nav className="bg-gradient-to-r">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex justify-center items-center py-4">
              <div className="flex flex-wrap justify-center gap-2">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        `flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 text-white ${
                          isActive
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg transform scale-105"
                            : "text-slate-700 hover:bg-green-100 hover:text-green-700 hover:shadow-md hover:scale-102"
                        }`
                      }
                      end={link.to === "/homepage"}
                    >
                      <IconComponent size={16} />
                      <span className="hidden sm:inline">{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Navbar;