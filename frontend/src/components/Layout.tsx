import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Header */}
      <header className="w-full bg-white shadow-lg border-b border-emerald-100 py-8 transition-all duration-500 animate-navbar-fade-in sticky top-0 z-40 backdrop-blur-md">
        <div className="w-full flex items-center px-8 relative">
          {/* Logo (extreme left) */}
          <div className="flex items-center justify-start">
            <Link to="/" className="flex items-center gap-6">
              <img src="/images/zerrah_logo_white_transparent.png" alt="Zerrah Logo" className="h-20 w-auto" />
              <span className="font-serif font-bold text-6xl text-emerald-700 tracking-tight transition-transform duration-150 hover:scale-105 hover:shadow-md" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Zerrah</span>
            </Link>
          </div>
          {/* Navigation (centered absolutely) */}
          <nav className="hidden md:flex items-center gap-16 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <NavLink to="/" className={({ isActive }) => `text-2xl font-bold px-7 py-3 rounded-xl transition-colors duration-150 ${isActive ? 'text-emerald-800 bg-emerald-50' : 'text-gray-500'} hover:bg-emerald-50 hover:text-emerald-700`}>Home</NavLink>
            <NavLink to="/quiz" className={({ isActive }) => `text-2xl font-bold px-7 py-3 rounded-xl transition-colors duration-150 ${isActive ? 'text-emerald-800 bg-emerald-50' : 'text-gray-500'} hover:bg-emerald-50 hover:text-emerald-700`}>Quiz</NavLink>
            <NavLink to="/reflections" className={({ isActive }) => `text-2xl font-bold px-7 py-3 rounded-xl transition-colors duration-150 ${isActive ? 'text-emerald-800 bg-emerald-50' : 'text-gray-500'} hover:bg-emerald-50 hover:text-emerald-700`}>Reflections</NavLink>
          </nav>
          {/* CTA (extreme right) */}
          <div className="flex items-center justify-end ml-auto">
            <Link to="/signup" className="ml-8 text-white rounded-full px-10 py-4 font-extrabold shadow border hover:scale-105 transition-all duration-150 text-2xl" style={{ backgroundColor: '#9BD290', borderColor: '#9BD290' }}>
              Join The Community
            </Link>
            {/* Hamburger for mobile */}
            <button
              className="md:hidden ml-6 p-3 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-transform duration-200"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-10 w-10 text-emerald-700 transition-transform duration-200 group-hover:rotate-90" />
            </button>
          </div>
        </div>
        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="bg-white w-[32rem] h-full shadow-lg rounded-r-3xl flex flex-col p-14 animate-slide-in-left">
              <button
                className="self-end mb-8 text-emerald-700 text-2xl font-bold transition-colors hover:text-emerald-900"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
              <nav className="flex flex-col gap-12">
                <Link to="/" className="text-gray-700 hover:text-emerald-600 text-3xl font-extrabold px-4 py-3 rounded-lg transition-colors" onClick={() => setMobileNavOpen(false)}>Home</Link>
                <Link to="/quiz" className="text-gray-700 hover:text-emerald-600 text-3xl font-extrabold px-4 py-3 rounded-lg transition-colors" onClick={() => setMobileNavOpen(false)}>Quiz</Link>
                <Link to="/reflections" className="text-gray-700 hover:text-emerald-600 text-3xl font-extrabold px-4 py-3 rounded-lg transition-colors" onClick={() => setMobileNavOpen(false)}>Reflections</Link>
                <Link to="/signup" className="mt-12 text-white rounded-full px-12 py-6 font-extrabold shadow border hover:scale-105 transition-all text-3xl text-center" style={{ backgroundColor: '#9BD290', borderColor: '#9BD290' }} onClick={() => setMobileNavOpen(false)}>Join the community</Link>
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
