import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Header */}
      <header className="w-full h-24 bg-white/80 shadow-sm border-b border-gray-100 px-6 flex items-center transition-all duration-500 animate-navbar-fade-in sticky top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative h-full">
          {/* Logo (extreme left) */}
          <div className="flex items-center justify-start h-full pl-6">
            <Link to="/" className="flex items-center h-full">
              <img src="/images/new_logo.png" alt="Zerrah Logo" className="h-40 w-auto object-contain m-0 p-0 drop-shadow-lg transition-all duration-300" />
            </Link>
          </div>
          {/* Navigation (centered) */}
          <nav className="hidden md:flex items-center gap-12">
            <NavLink to="/" className={({ isActive }) => `text-lg font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${isActive ? 'text-[#5E1614] bg-white shadow-sm ring-1 ring-gray-100' : 'text-gray-600'} hover:bg-white hover:text-[#5E1614] hover:shadow-sm hover:ring-1 hover:ring-gray-100`}>Home</NavLink>
            <NavLink to="/quiz" className={({ isActive }) => `text-lg font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${isActive ? 'text-[#5E1614] bg-white shadow-sm ring-1 ring-gray-100' : 'text-gray-600'} hover:bg-white hover:text-[#5E1614] hover:shadow-sm hover:ring-1 hover:ring-gray-100`}>Quiz</NavLink>
            <NavLink to="/reflections" className={({ isActive }) => `text-lg font-semibold px-5 py-2.5 rounded-lg transition-all duration-200 ease-in-out ${isActive ? 'text-[#5E1614] bg-white shadow-sm ring-1 ring-gray-100' : 'text-gray-600'} hover:bg-white hover:text-[#5E1614] hover:shadow-sm hover:ring-1 hover:ring-gray-100`}>Reflections</NavLink>
          </nav>
          {/* CTA (extreme right) */}
          <div className="flex items-center justify-end">
            <Link to="/signup" className="ml-8 text-white rounded-xl px-8 py-3 font-semibold text-lg shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" style={{ backgroundColor: '#5E1614' }}>
              Join The Community
            </Link>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-6 p-2 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-8 w-8 text-gray-700" />
            </button>
          </div>
        </div>
        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex">
            <div className="bg-white w-[90%] max-w-md h-full shadow-xl flex flex-col p-8 animate-slide-in-left">
              <div className="flex justify-between items-center mb-8">
                <img src="/images/new_logo.png" alt="Zerrah Logo" className="h-16 w-auto" />
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={() => setMobileNavOpen(false)}
                  aria-label="Close navigation menu"
                >
                  <X className="h-6 w-6 text-gray-700" />
                </button>
              </div>
              <nav className="flex flex-col gap-4">
                <Link 
                  to="/" 
                  className="text-gray-800 hover:text-[#5E1614] hover:bg-gray-50 text-lg font-semibold px-4 py-3 rounded-lg transition-all duration-200" 
                  onClick={() => setMobileNavOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  to="/quiz" 
                  className="text-gray-800 hover:text-[#5E1614] hover:bg-gray-50 text-lg font-semibold px-4 py-3 rounded-lg transition-all duration-200" 
                  onClick={() => setMobileNavOpen(false)}
                >
                  Quiz
                </Link>
                <Link 
                  to="/reflections" 
                  className="text-gray-800 hover:text-[#5E1614] hover:bg-gray-50 text-lg font-semibold px-4 py-3 rounded-lg transition-all duration-200" 
                  onClick={() => setMobileNavOpen(false)}
                >
                  Reflections
                </Link>
                <Link 
                  to="/signup" 
                  className="mt-8 text-white rounded-xl px-6 py-3 font-semibold text-lg text-center shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:scale-[1.02] active:scale-[0.98]" 
                  style={{ backgroundColor: '#5E1614' }} 
                  onClick={() => setMobileNavOpen(false)}
                >
                  Join the community
                </Link>
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
      </header>
      <main className="flex-grow pt-8 md:pt-12">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
