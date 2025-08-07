import { assets, footerLinks } from "../assets/assets";
import { Link } from "react-router-dom";

// Icon components for social media links
const FacebookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
  
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);

const TwitterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
);

const Footer = () => {
  return (
    // Main container with a rich, dark brown background
    <footer className="bg-[#815a58] text-stone-100 font-serif">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">
        
        {/* Top section with logo, links, and social media */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-stone-600 pb-8">
          <Link to="/" className="flex-shrink-0">
            <img className="w-32" src={assets.logo} alt="logo" />
          </Link>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks[0].links.map((link, i) => (
              <a key={i} href={link.url} className="hover:text-amber-500 transition-colors duration-300">
                {link.text}
              </a>
            ))}
            {footerLinks[1].links.map((link, i) => (
              <a key={i} href={link.url} className="hover:text-amber-500 transition-colors duration-300">
                {link.text}
              </a>
            ))}
          </div>

          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook" className="hover:text-amber-500 transition-colors">
              <FacebookIcon />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-amber-500 transition-colors">
              <InstagramIcon />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-amber-500 transition-colors">
              <TwitterIcon />
            </a>
          </div>
        </div>
        
        {/* Bottom section with copyright */}
        <div className="text-center pt-8">
          <p className="text-sm text-stone-300">
            &copy; {new Date().getFullYear()} GreenCart Furniture. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;