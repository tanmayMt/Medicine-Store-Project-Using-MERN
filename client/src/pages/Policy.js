import React from "react";
import Layout from "../components/Layout/Layout";

const policyPoints = [
  {
    title: "Information Collection:",
    body: "We collect personal information you provide when you register or make a purchase.",
  },
  {
    title: "Data Usage:",
    body: "Your data is used solely to process orders and improve your shopping experience.",
  },
  {
    title: "Security:",
    body: "We implement standard security measures to protect your personal information.",
  },
  {
    title: "Third Parties:",
    body: "We do not sell or trade your personally identifiable information to outside parties.",
  },
  {
    title: "Cookies:",
    body: "Our site uses cookies to enhance your user experience.",
  },
  {
    title: "Consent:",
    body: "By using our site, you consent to our privacy policy.",
  },
  {
    title: "Updates:",
    body: "Any changes to our privacy policy will be posted on this page.",
  },
];

const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <div className="overflow-x-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/30">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Image first: on mobile appears above content; on desktop left column */}
            <div className="w-full">
              <figure className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white/80 p-2 shadow-lg shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.03]">
                <img
                  src="/images/contactus.jpeg"
                  alt="Medicure privacy and customer trust"
                  className="aspect-[4/3] w-full rounded-xl object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </div>

            <div className="min-w-0">
              <span className="inline-flex rounded-full border border-sky-200/90 bg-sky-50/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-sky-800">
                Privacy &amp; security
              </span>
              <h1 className="mt-3 font-playfair text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Privacy Policy
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                We are committed to protecting your personal information and being transparent about how we
                collect, use, and safeguard your data when you shop with Medicure.
              </p>

              <div className="mt-8 rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-md shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.02] sm:p-6 lg:p-7">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Key points</h2>
                <ol className="mt-5 list-none space-y-4 p-0">
                  {policyPoints.map((item, index) => (
                    <li
                      key={item.title}
                      className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-sky-100 hover:bg-white sm:gap-5 sm:p-4"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-600 to-blue-700 text-sm font-bold text-white shadow-sm ring-2 ring-white"
                        aria-hidden
                      >
                        {index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 sm:text-base">{item.title}</p>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:text-[15px]">{item.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
