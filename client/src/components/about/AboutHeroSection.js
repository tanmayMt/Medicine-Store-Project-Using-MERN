import React from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiMessageCircle,
  FiShield,
  FiTruck,
  FiClock,
  FiUsers,
} from "react-icons/fi";

const highlights = [
  {
    icon: FiShield,
    title: "Genuine Medicines",
    description: "Verified sourcing and quality you can trust.",
  },
  {
    icon: FiTruck,
    title: "Fast Delivery",
    description: "Reliable fulfilment to your doorstep.",
  },
  {
    icon: FiClock,
    title: "24/7 Customer Support",
    description: "We are here whenever you need assistance.",
  },
  {
    icon: FiUsers,
    title: "Trusted Healthcare Experts",
    description: "Guided care from people who understand health.",
  },
];

/**
 * Premium healthcare-focused About hero — split layout, accessible, responsive.
 */
const AboutHeroSection = () => {
  return (
    <section
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-teal-50/40"
      aria-labelledby="about-heading"
    >
      {/* Soft ambient accents */}
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full bg-teal-200/25 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 left-[-10%] h-[22rem] w-[22rem] rounded-full bg-orange-200/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/15 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Image — left on desktop */}
          <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
            <div
              className="relative w-full max-w-md animate-fade-in-up lg:max-w-lg"
              style={{ animationDelay: "80ms" }}
            >
              {/* Decorative stack behind card */}
              <div
                className="pointer-events-none absolute -left-3 -top-3 h-28 w-28 rounded-2xl bg-teal-400/20 ring-1 ring-teal-500/10 transition-transform duration-500 ease-out sm:-left-4 sm:-top-4 sm:h-32 sm:w-32"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-4 -right-5 h-36 w-36 rounded-full bg-orange-400/15 blur-sm ring-1 ring-orange-400/10 sm:-bottom-5 sm:-right-8 sm:h-44 sm:w-44"
                aria-hidden
              />

              <figure className="group relative rounded-2xl border border-slate-200/90 bg-white/80 p-2 shadow-xl shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.04] backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:border-teal-200/80 hover:shadow-2xl hover:shadow-teal-900/[0.08]">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/images/about.jpeg"
                    alt="Medicure team and pharmacy care environment"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                    loading="eager"
                    decoding="async"
                  />
                </div>
                <figcaption className="sr-only">
                  Medicure healthcare and pharmacy imagery representing our commitment to care.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* Content — right on desktop */}
          <div
            className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left animate-fade-in-up"
            style={{ animationDelay: "160ms" }}
          >
            <span className="mb-4 inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50/90 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-teal-800 shadow-sm shadow-teal-900/5">
              About Medicure
            </span>

            <h1
              id="about-heading"
              className="font-playfair text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
            >
              Trusted Healthcare for Every Home
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
              Welcome to Medicure — your partner in health and wellness. We connect you with
              high-quality medicines and everyday care essentials, backed by technology that makes
              ordering simple and delivery dependable. From prescriptions to wellness products, we
              are committed to genuine products, transparent service, and support you can count on.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start">
              <Link
                to="/categories"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.98]"
              >
                Explore Products
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300/90 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.98]"
              >
                <FiMessageCircle className="h-4 w-4 text-teal-700" aria-hidden />
                Contact Us
              </Link>
            </div>

            {/* Feature grid */}
            <ul className="mt-12 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:max-w-none">
              {highlights.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/70 p-4 text-left shadow-sm shadow-slate-900/[0.03] ring-1 ring-slate-900/[0.02] transition duration-300 hover:border-teal-200/70 hover:bg-white hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-slate-900">{title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-600 sm:text-sm">
                      {description}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHeroSection;
