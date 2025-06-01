import React from 'react';

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.056 1.97.24 2.43.41.59.22 1.01.48 1.45.92.44.44.7.86.92 1.45.17.46.354 1.26.41 2.43.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.056 1.17-.24 1.97-.41 2.43-.22.59-.48 1.01-.92 1.45-.44.44-.86.7-1.45.92-.46.17-1.26.354-2.43.41-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.056-1.97-.24-2.43-.41-.59-.22-1.01-.48-1.45-.92-.44-.44-.7-.86-.92-1.45-.17-.46-.354-1.26-.41-2.43C2.212 15.784 2.2 15.4 2.2 12s.012-3.584.07-4.85c.056-1.17.24-1.97.41-2.43.22-.59.48-1.01.92-1.45.44-.44.86-.7 1.45-.92.46-.17 1.26-.354 2.43-.41C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.87.312 4.13.54c-.77.24-1.42.56-2.07 1.21-.65.65-.97 1.3-1.21 2.07-.228.74-.412 1.64-.47 2.92C.012 8.332 0 8.736 0 12c0 3.264.012 3.668.07 4.948.058 1.28.242 2.18.47 2.92.24.77.56 1.42 1.21 2.07.65.65 1.3.97 2.07 1.21.74.228 1.64.412 2.92.47C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.28-.058 2.18-.242 2.92-.47.77-.24 1.42-.56 2.07-1.21.65-.65.97-1.3 1.21-2.07.228-.74.412-1.64.47-2.92.058-1.28.07-1.684.07-4.948 0-3.264-.012-3.668-.07-4.948-.058-1.28-.242-2.18-.47-2.92-.24-.77-.56-1.42-1.21-2.07-.65-.65-1.3-.97-2.07-1.21-.74-.228-1.64-.412-2.92-.47C15.668.012 15.264 0 12 0z"/><path d="M12 5.838A6.162 6.162 0 1 0 12 18.162 6.162 6.162 0 1 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8.001a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg>
);
const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm13.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
);

const Footer = () => (
  <footer className="w-full border-t border-emerald-900/30 py-12 bg-gradient-to-r from-emerald-700 via-emerald-800 to-emerald-700 text-white shadow-lg mt-24">
    {/* Top-centered logo and tagline */}
    <div className="w-full flex flex-col items-center justify-center mb-8">
      <img src="/images/zerrah_logo_white_transparent.png" alt="Zerrah Logo" className="h-14 w-auto opacity-90 mb-2" />
      <span className="text-emerald-100 text-base text-center max-w-xl">
        Zerrah helps you understand and reduce your climate impact—joyfully, simply, and personally.
      </span>
    </div>
    {/* Navigation, Connect, Resources */}
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between px-8 gap-12">
      <div>
        <h4 className="font-semibold mb-3 text-lg text-white tracking-wide">Navigation</h4>
        <ul className="space-y-1">
          <li><a href="/" className="text-emerald-100 hover:text-white transition">Home</a></li>
          <li><a href="/quiz" className="text-emerald-100 hover:text-white transition">Quiz</a></li>
          <li><a href="/reflections" className="text-emerald-100 hover:text-white transition">Reflections</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-lg text-white tracking-wide">Connect</h4>
        <ul className="space-y-1">
          <li>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-100 hover:text-white transition">
              <InstagramIcon className="h-4 w-4" /> Instagram
            </a>
          </li>
          <li>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-emerald-100 hover:text-white transition">
              <LinkedInIcon className="h-4 w-4" /> LinkedIn
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-lg text-white tracking-wide">Resources</h4>
        <ul className="space-y-1">
          <li><a href="#" className="text-emerald-100 hover:text-white transition">Sustainability Tips</a></li>
          <li><a href="#" className="text-emerald-100 hover:text-white transition">FAQ</a></li>
        </ul>
      </div>
    </div>
    <div className="mt-10 pt-6 border-t border-emerald-900/30 text-center text-sm text-emerald-100/80 flex flex-col md:flex-row justify-between items-center gap-2 mx-4">
      <span>© {new Date().getFullYear()} Zerrah. All rights reserved.</span>
      <div className="flex gap-4">
        <a href="#" className="hover:text-white transition">Privacy Policy</a>
        <a href="#" className="hover:text-white transition">Terms</a>
      </div>
    </div>
  </footer>
);

export default Footer; 