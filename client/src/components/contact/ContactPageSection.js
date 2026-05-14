import React, { useState } from "react";
import toast from "react-hot-toast";
import {
  FiMail,
  FiPhone,
  FiHeadphones,
  FiClock,
  FiSend,
  FiShield,
  FiZap,
  FiLock,
} from "react-icons/fi";

const contactChannels = [
  {
    icon: FiMail,
    title: "Email support",
    value: "help@medicure.com",
    href: "mailto:help@medicure.com",
    hint: "We reply within one business day",
  },
  {
    icon: FiPhone,
    title: "Phone support",
    value: "+91 8768006557",
    href: "tel:+918768006557",
    hint: "Speak with our care team",
  },
  {
    icon: FiHeadphones,
    title: "Toll free",
    value: "1800-000-0000",
    href: "tel:18000000000",
    hint: "No charge for your call",
  },
  {
    icon: FiClock,
    title: "24/7 customer care",
    value: "Always available",
    href: "tel:+918768006557",
    hint: "Urgent orders & guidance",
  },
];

const trustItems = [
  {
    icon: FiClock,
    title: "24/7 support",
    text: "Round-the-clock assistance for orders and enquiries.",
  },
  {
    icon: FiShield,
    title: "Genuine healthcare assistance",
    text: "Trained advisors focused on safe, reliable guidance.",
  },
  {
    icon: FiZap,
    title: "Fast response",
    text: "We prioritise timely replies across all channels.",
  },
  {
    icon: FiLock,
    title: "Secure communication",
    text: "Your details are handled with care and discretion.",
  },
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const ContactPageSection = () => {
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setSending(true);
    await new Promise((r) => setTimeout(r, 450));
    toast.success("Thank you — we have received your message and will get back to you shortly.");
    setForm(initialForm);
    setSending(false);
  };

  return (
    <>
      <section
        className="relative isolate overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-slate-50/90"
        aria-labelledby="contact-heading"
      >
        <div
          className="pointer-events-none absolute -top-32 right-[-5%] h-[26rem] w-[26rem] rounded-full bg-sky-200/30 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-20 left-[-8%] h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:px-8 lg:pb-24 lg:pt-20">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            {/* Image */}
            <div className="order-2 flex justify-center lg:order-1 lg:justify-start animate-fade-in-up">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <div
                  className="pointer-events-none absolute -left-2 -top-2 h-24 w-24 rounded-2xl bg-sky-300/25 ring-1 ring-sky-400/10 sm:h-28 sm:w-28"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-3 -right-4 h-32 w-32 rounded-full bg-blue-200/25 blur-md"
                  aria-hidden
                />
                <figure className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 p-2 shadow-xl shadow-slate-900/[0.06] ring-1 ring-slate-900/[0.04] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-sky-200/80 hover:shadow-2xl">
                  <img
                    src="/images/contactus.jpeg"
                    alt="Medicure customer care and pharmacy support"
                    className="aspect-[4/3] w-full rounded-xl object-cover transition duration-700 group-hover:scale-[1.02]"
                    loading="eager"
                    decoding="async"
                  />
                </figure>
              </div>
            </div>

            {/* Content + cards + form */}
            <div
              className="order-1 space-y-8 lg:order-2 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <header className="text-center lg:text-left">
                <span className="mb-3 inline-flex items-center rounded-full border border-sky-200/90 bg-white/90 px-4 py-1.5 text-[11px] font-semibold tracking-wide text-sky-800 shadow-sm">
                  Get in touch
                </span>
                <h1
                  id="contact-heading"
                  className="font-playfair text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-[2.5rem] lg:leading-[1.12]"
                >
                  We&apos;re Here to Help You
                </h1>
                <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
                  Questions about products, orders, or your health journey? Reach out anytime — our team
                  is ready with clear answers and dependable support.
                </p>
              </header>

              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                {contactChannels.map(({ icon: Icon, title, value, href, hint }) => (
                  <li key={title}>
                    <a
                      href={href}
                      className="flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm shadow-slate-900/[0.03] ring-1 ring-slate-900/[0.02] transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/90 hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
                    >
                      <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {title}
                      </span>
                      <span className="mt-1 text-sm font-semibold text-slate-900">{value}</span>
                      <span className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-6 shadow-lg shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.03] backdrop-blur-sm sm:p-8">
                <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Fill in the form below and we will respond as soon as possible.
                </p>
                <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-fullName" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Full name
                      </label>
                      <input
                        id="contact-fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        value={form.fullName}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Email address
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-phone" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Phone number
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                        placeholder="+91 …"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Subject
                      </label>
                      <input
                        id="contact-subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                        placeholder="How can we help?"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      value={form.message}
                      onChange={handleChange}
                      className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/25"
                      placeholder="Tell us more…"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {sending ? (
                      "Sending…"
                    ) : (
                      <>
                        <FiSend className="h-4 w-4" aria-hidden />
                        Send message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section
        className="border-t border-slate-200/80 bg-gradient-to-b from-slate-50 to-white py-14 sm:py-16"
        aria-label="Why contact Medicure"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-playfair text-2xl font-bold text-slate-900 sm:text-3xl">Why you can rely on us</h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
              The same standards we apply to medicines apply to how we listen and respond.
            </p>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {trustItems.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:border-sky-200/80 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-900">{title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-slate-600 sm:text-sm">{text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
};

export default ContactPageSection;
