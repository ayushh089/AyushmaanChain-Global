import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AyushmaanChainLanding = () => {
  const [activeTab, setActiveTab] = useState("patient");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation - Responsive */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-green-600"
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
                <span className="text-xl font-bold text-gray-800">
                  AyushmaanChain
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl sm:leading-tight lg:text-5xl">
            <span className="block">Healthcare that actually</span>
            <span className="block text-green-600">works for you</span>
          </h1>
          <p className="mt-3 sm:mt-5 max-w-xl mx-auto text-base sm:text-lg text-gray-600">
            A human-centered approach to medical records, prescriptions, and medicine verification.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2.5 sm:px-6 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center justify-center"
            >
              Get Started
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <button
              onClick={() => document.getElementById("how-it-works").scrollIntoView({ behavior: 'smooth' })}
              className="px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              How it works
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* User Type Selector - Responsive */}
      <div className="bg-gray-50 py-8 sm:py-12 border-y border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Designed for real people in healthcare
            </h2>
            <div className="mt-4 sm:mt-6">
              <div className="flex flex-wrap justify-center gap-2">
                {["patient", "doctor", "pharmacy", "manufacturer"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1) + "s"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Responsive */}
      <div id="features" className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              What makes us different
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              We built this for our grandparents who struggled with fake medicines and lost prescriptions
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Real prescriptions</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Doctors issue verifiable digital prescriptions that can't be forged or reused. 
                No more worrying about lost paper slips.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Your records, your control</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Keep all your medical history in one secure place that you control. 
                Share with doctors when needed, keep private when you don't.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Medicine you can trust</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Scan any medicine package to verify its authenticity. 
                We track every batch from manufacturer to pharmacy shelf.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-green-300 transition-colors shadow-sm hover:shadow-md">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Community powered</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Join a network of patients and providers working together to 
                make healthcare more transparent and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Responsive */}
      <div id="how-it-works" className="py-12 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Simple steps to safer healthcare
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              We've kept it straightforward because healthcare is complicated enough
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Step 1 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  1
                </div>
              </div>
              <div className="pt-0.5 sm:pt-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Doctor creates prescription</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your doctor issues a digital prescription that gets recorded on the blockchain. 
                  No more lost paper slips or forged prescriptions.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  2
                </div>
              </div>
              <div className="pt-0.5 sm:pt-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">You store your records</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Your medical history stays encrypted and under your control. 
                  You decide which doctors can access which parts of your records.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  3
                </div>
              </div>
              <div className="pt-0.5 sm:pt-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Pharmacy verifies</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  The pharmacy checks both your prescription and the medicine's 
                  authenticity against our blockchain records before dispensing.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base">
                  4
                </div>
              </div>
              <div className="pt-0.5 sm:pt-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Secure transaction</h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Everything gets recorded securely. You get a notification, 
                  and the system prevents prescription reuse or medicine fraud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Responsive */}
      <div className="bg-white py-12 sm:py-16 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-50 rounded-xl p-6 sm:p-8 md:p-10 border border-green-100">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready for healthcare you can trust?
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
              Join thousands of patients and providers using AyushmaanChain today
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md text-sm sm:text-base"
              >
                Sign up free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2.5 sm:px-6 sm:py-3 border border-gray-300 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                Already have an account? Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="bg-white border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-medium text-gray-800">AyushmaanChain</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">About</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">Privacy</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">Terms</a>
              <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">Contact</a>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} AyushmaanChain. Made with care in India.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AyushmaanChainLanding;