import React from "react";
import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiHeart, FiFacebook, FiInstagram, FiTwitter } from "react-icons/fi";

const footerLinkClass =
  "text-sm text-slate-400 transition hover:text-white hover:underline underline-offset-4";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-9 lg:px-8 lg:py-10">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/20 text-sky-400 ring-1 ring-sky-400/30">
                <FiHeart className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">Medicure</span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
              Your trusted online pharmacy — genuine medicines, careful fulfilment, and support that puts
              your wellbeing first.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <a
                href="mailto:help@medicure.com"
                className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white"
              >
                <FiMail className="h-4 w-4 text-sky-400" aria-hidden />
                help@medicure.com
              </a>
              <a href="tel:+918768006557" className="inline-flex items-center gap-2 text-slate-300 transition hover:text-white">
                <FiPhone className="h-4 w-4 text-sky-400" aria-hidden />
                +91 8768006557
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:col-span-4 lg:grid-cols-2">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Explore</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to="/" className={footerLinkClass}>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/categories" className={footerLinkClass}>
                    Categories
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className={footerLinkClass}>
                    Cart
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Company</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link to="/about" className={footerLinkClass}>
                    About us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={footerLinkClass}>
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/policy" className={footerLinkClass}>
                    Privacy policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Follow us</h2>
            <p className="mt-2 text-xs text-slate-500 sm:text-sm">Stay connected for health tips and offers.</p>
            <div className="mt-4 flex gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white"
                aria-label="Facebook"
              >
                <FiFacebook className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white"
                aria-label="Instagram"
              >
                <FiInstagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800/50 text-slate-300 transition hover:border-sky-500/50 hover:bg-sky-500/10 hover:text-white"
                aria-label="Twitter"
              >
                <FiTwitter className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800/90 pt-5 text-center text-xs text-slate-500">
          <p>&copy; {year} Medicure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
