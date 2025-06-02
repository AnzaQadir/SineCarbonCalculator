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
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo + Wordmark */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/zerrah_logo_white_transparent.png" alt="Zerrah Logo" className="h-10 w-auto" />
            <span className="font-serif font-bold text-3xl text-emerald-700 tracking-tight">Zerrah</span>
          </Link>
          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
            <NavLink to="/quiz" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Quiz</NavLink>
            <NavLink to="/reflections" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Reflections</NavLink>
          </nav>
          {/* CTA */}
          <Link to="/signup" className="ml-8 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-full px-6 py-2 font-bold shadow hover:from-emerald-600 hover:to-teal-500 transition text-base md:text-lg">
            Join The Community
          </Link>
          {/* Hamburger for mobile */}
          <button
            className="md:hidden ml-4 p-2 rounded focus:outline-none focus:ring-2 focus:ring-emerald-400"
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-8 w-8 text-emerald-700" />
          </button>
        </div>
        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 flex">
            <div className="bg-white w-64 h-full shadow-lg flex flex-col p-6 animate-slide-in-left">
              <button
                className="self-end mb-8 text-emerald-700 text-2xl font-bold"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close navigation menu"
              >
                ×
              </button>
              <nav className="flex flex-col gap-6">
                <Link to="/" className="text-gray-700 hover:text-emerald-600 text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>Home</Link>
                <Link to="/quiz" className="text-gray-700 hover:text-emerald-600 text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>Quiz</Link>
                <Link to="/reflections" className="text-gray-700 hover:text-emerald-600 text-lg font-semibold" onClick={() => setMobileNavOpen(false)}>Reflections</Link>
                <Link to="/signup" className="mt-4 bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-lg text-center" onClick={() => setMobileNavOpen(false)}>Join the community</Link>
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
      </header>
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
