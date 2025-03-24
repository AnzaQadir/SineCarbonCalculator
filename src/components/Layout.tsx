
import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <Leaf className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
            <span className="font-medium text-xl">CarbonCalc</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Calculator
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Resources
            </Link>
          </nav>
          <div className="hidden md:block">
            <Link 
              to="/" 
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              Offset Your Footprint
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-muted/30 border-t border-border/40 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Leaf className="h-5 w-5 text-primary" />
                <span className="font-medium text-lg">CarbonCalc</span>
              </div>
              <p className="text-muted-foreground">
                Helping you understand and reduce your carbon footprint with precision and clarity.
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
            <p>© {new Date().getFullYear()} CarbonCalc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
