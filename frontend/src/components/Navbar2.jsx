import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const profileRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "";
  const userInitials = userName ? userName.charAt(0).toUpperCase() : "";

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle scroll effect for navbar shadow/blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm py-3' 
            : 'bg-transparent border-b border-transparent py-5'
        }`}
      >
        {/* Subtle Background Grid Pattern (Only visible when not scrolled) */}
        {!isScrolled && (
          <div 
            className="absolute inset-0 z-[-1] opacity-[0.02] pointer-events-none" 
            style={{
              // Restored the proper SVG grid URL here
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm39 39V1H1v38h38z' fill='%23000' fill-rule='evenodd'/%3E%3C/svg%3E")`
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 cursor-pointer">
              {/* Image from public folder */}
              <img 
                src="/favicon.png" 
                alt="LegalFlow AI Logo" 
                className="w-10 h-10 object-contain" 
              />
              
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                LegalFlow AI
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-6 relative">
              {token ? (
                <div 
                  className="flex items-center gap-2 cursor-pointer"
                  ref={profileRef}
                  onClick={() => setShowProfile(!showProfile)}
                >
                  <div className="w-8 h-8 bg-green-700 text-white rounded-full flex items-center justify-center font-medium">
                    {userInitials}
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{userName}</p>
                  </div>
                  
                  {/* Profile Dropdown */}
                  {showProfile && (
                    <div className="absolute right-0 top-12 w-52 bg-white rounded-xl shadow-xl z-50 border border-gray-100">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">Legal Professional</p>
                      </div>
                      <div className="p-2 text-sm space-y-1">
                        <button onClick={() => navigate("/dashboard")} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                          <User size={16} />
                          Go to Dashboard
                        </button>
                        <button onClick={() => navigate("/settings")} className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700">
                          <Settings size={16} />
                          Settings
                        </button>
                        <button 
                          onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("userName");
                            window.location.reload();
                          }} 
                          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-gray-50 text-red-600"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <a 
                    href="/login" 
                    className="text-gray-900 hover:text-[#047857] font-medium text-sm transition-colors"
                  >
                    Sign In
                  </a>
                  <button onClick={() => navigate("/login")} className="bg-[#047857] hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow">
                    Get Started
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button 
              className="md:hidden text-gray-600 p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white border-b border-gray-100 shadow-xl md:hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
                {token ? (
                  <>
                    <button onClick={() => navigate("/dashboard")} className="block px-3 py-3 text-center rounded-lg text-base font-medium text-white bg-[#047857] hover:bg-emerald-800">
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("userName");
                        window.location.reload();
                      }} 
                      className="block px-3 py-2 text-center rounded-lg text-base font-medium text-red-600 bg-red-50 hover:bg-red-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="block px-3 py-2 text-center rounded-lg text-base font-medium text-gray-900 hover:bg-gray-50 border border-gray-200"
                    >
                      Sign In
                    </a>
                    <button onClick={() => navigate("/login")} className="w-full bg-[#047857] hover:bg-emerald-800 text-white px-3 py-3 rounded-lg font-semibold text-base transition-colors">
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar2;