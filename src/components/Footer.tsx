import React from "react";
import Link from "next/link";
import RatihLogo from "./RatihLogo";

const Footer = () => {
  return (
    <footer className="bg-black py-12 relative overflow-hidden">
      <div className="absolute inset-0 pattern-overlay"></div>
      <div className="mx-4 px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="md:w-1/2">
              <RatihLogo />
            </div>
            <div className="md:w-1/2">
              <h1 className="md:w-1/2">
                <span className=" text-white font-bold text-base">
                  RATIH
                </span>
                <span className="text-ratih-gold text-base"> Creative</span>
              </h1>
            </div>
            <p className="mt-4 text-gray-400 max-w-md">
              A production house with a simple team working in photography,
              videography, and graphic design. Founded in November 2021.
            </p>
            <div className="mt-6 flex space-x-4">
              <a
                href="https://instagram.com"
                className="text-gray-400 hover:text-ratih-gold transition-colors duration-300 px-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-ratih-gold transition-colors duration-300 px-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                className="text-gray-400 hover:text-ratih-gold transition-colors duration-300 px-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4 font">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li className="py-1">
                <Link
                  href="/"
                  className="text-gray-400 hover:text-ratih-gold transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/team"
                  className="text-gray-400 hover:text-ratih-gold transition-colors duration-300"
                >
                  Our Team
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/articles"
                  className="text-gray-400 hover:text-ratih-gold transition-colors duration-300"
                >
                  Articles
                </Link>
              </li>
              <li className="py-1">
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-ratih-gold transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start space-x-3 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-6 mt-0.5 text-ratih-gold"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="px-2">
                  Surabaya, Malang, and Madiun, Indonesia
                </span>
              </li>
              <li className="flex items-start space-x-3 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 text-ratih-gold"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="px-2">+62 812 3456 7890</span>
              </li>
              <li className="flex items-start space-x-3 py-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mt-0.5 text-ratih-gold"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="px-2">info@ratihcreative.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Ratih Creative. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
