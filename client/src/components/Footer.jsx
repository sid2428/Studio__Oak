import { footerLinks } from "../assets/assets";
import { Link } from "react-router-dom";

// Icons (These can stay as they are well-defined)
const FacebookIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg> );
const InstagramIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg> );
const TwitterIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg> );

const Footer = () => {
  return (
    <footer className="bg-surface text-stone-700 font-serif border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main multi-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Column 1: New "Studio Oak" text logo and Brand Statement */}
          <div className="lg:col-span-2 pr-8">
            <Link to="/" className="inline-block mb-4">
              {/* MODIFIED: Replaced image logo with a styled text logo */}
              <h1 className="text-2xl font-bold text-stone-800 font-serif tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>Studio Oak</h1>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed">
              Crafting timeless furniture for the modern home. We believe in quality, design, and sustainability.
            </p>
          </div>

          {/* Column 2: Shop Links */}
          <div>
            <h3 className="font-semibold text-stone-800 tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-3">
              {footerLinks[0].links.map((link) => (
                <li key={link.text}>
                  <Link to={link.url} className="text-sm text-stone-500 hover:text-amber-700 transition-colors">{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Support Links */}
          <div>
            <h3 className="font-semibold text-stone-800 tracking-wider uppercase mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks[1].links.map((link) => (
                <li key={link.text}>
                  <Link to={link.url} className="text-sm text-stone-500 hover:text-amber-700 transition-colors">{link.text}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Social Links */}
          <div>
            <h3 className="font-semibold text-stone-800 tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-stone-500 hover:text-amber-700 transition-colors"><FacebookIcon /></a>
              <a href="#" aria-label="Instagram" className="text-stone-500 hover:text-amber-700 transition-colors"><InstagramIcon /></a>
              <a href="#" aria-label="Twitter" className="text-stone-500 hover:text-amber-700 transition-colors"><TwitterIcon /></a>
            </div>
          </div>
        </div>
        
        {/* Bottom section with updated copyright */}
        <div className="mt-12 pt-8 border-t border-stone-200 text-center">
          <p className="text-sm text-stone-400">
            {/* MODIFIED: Updated the copyright statement */}
            &copy; {new Date().getFullYear()} Studio Oak. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;