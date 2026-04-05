import React from 'react';

const Footer = () => {
  // Footer link data for easy maintenance
  const footerLinks = {
    Product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Integrations', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Status', href: '#' },
    ],
    Legal: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
      { name: 'GDPR', href: '#' },
    ],
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#FAFAFA] font-sans pt-20 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Column (Takes up 2 columns on large screens) */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Custom Image Logo from Public Folder */}
              <img 
                src="/legoace_logo.png" 
                alt="LegalFlow AI Logo" 
                className="w-8 h-8 object-contain"
                // Fallback style just in case the image hasn't been placed yet
                style={{ backgroundColor: 'transparent' }} 
              />
              <span className="text-xl font-bold text-gray-900 tracking-tight">
                LegalFlow AI
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              AI-enhanced legal case management platform that helps lawyers manage cases, 
              documents, and deadlines intelligently.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="font-semibold text-gray-900 mb-6">
                {category}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-gray-500 hover:text-emerald-600 text-sm transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {/* Hardcoded to 2026 to match your screenshot exactly, though {currentYear} is better practice! */}
            2026 LegalFlow AI. All rights reserved.
          </p>
          
          <p className="text-sm text-gray-500">
            Built by Data Science Department, RCOEM Nagpur
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;