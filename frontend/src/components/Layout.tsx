import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Responsive Header */}
      <header className="w-full bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-6">
          {/* Logo + Wordmark */}
          <div className="flex items-center pl-8 mr-6">
            <div className="flex items-center justify-center">
              <img
                src="/images/zerrah_logo_globe_bolder_5120px.png"
                alt="Zerrah - Sustainability Platform"
                className="h-32 w-auto drop-shadow-lg"
                style={{ minWidth: 128 }}
              />
            </div>
            <span
              className="font-serif font-semibold text-6xl tracking-wide ml-1 flex items-center"
              style={{ color: '#007C78', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, lineHeight: 1, height: '128px' }}
            >
              Zerrah
            </span>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Home</Link>
            <Link to="/quiz" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Quiz</Link>
            <Link to="/reflections" className="text-gray-600 hover:text-emerald-600 font-medium text-base md:text-lg transition">Reflections</Link>
          </nav>
          <Link to="/signup" className="hidden md:inline-block ml-8 bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-base md:text-lg">Get Started</Link>
          {/* Mobile Hamburger */}
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
                <Link to="/signup" className="mt-4 bg-emerald-600 text-white rounded-full px-6 py-2 font-bold shadow hover:bg-emerald-700 transition text-lg text-center" onClick={() => setMobileNavOpen(false)}>Get Started</Link>
              </nav>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}
      </header>
      <main className="flex-grow">{children}</main>
      <footer className="bg-muted/30 border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/images/logo.png" alt="Zerrah Logo" className="h-5 w-5" />
                <span className="font-serif text-xl">Zerrah</span>
              </div>
              <p className="text-muted-foreground">
                Zerrah helps you understand and reduce your climate impact—joyfully, simply, and personally.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Carbon Offsetting
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Sustainability Tips
                  </Link>
                </li>
                <li>
                  <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border/40 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Zerrah. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
