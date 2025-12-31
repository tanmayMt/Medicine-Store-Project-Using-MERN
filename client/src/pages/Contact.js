import React from "react";
import Layout from "./../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";

const Contact = () => {
  return (
    <Layout title={"Contact us"}>
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-[70vh] px-4 md:px-12 py-8">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/contactus.jpeg"
            alt="contact us"
            className="w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Right Column: Information */}
        <div className="w-full md:w-1/3">
          <h1 className="text-3xl font-bold bg-gray-900 text-white p-3 text-center rounded mb-6">
            CONTACT US
          </h1>
          <p className="text-justify text-gray-600 mb-6 leading-relaxed">
            For any queries or information about our products, feel free to call us anytime.
            We are available 24x7 to assist you.
          </p>
          
          <div className="space-y-4">
            <p className="flex items-center gap-3 text-lg text-gray-800 hover:text-blue-600 transition-colors">
              <BiMailSend className="w-6 h-6" /> 
              <span>www.help@medicure.com</span>
            </p>
            <p className="flex items-center gap-3 text-lg text-gray-800 hover:text-blue-600 transition-colors">
              <BiPhoneCall className="w-6 h-6" />
              <span>+91 8768006557</span>
            </p>
            <p className="flex items-center gap-3 text-lg text-gray-800 hover:text-blue-600 transition-colors">
              <BiSupport className="w-6 h-6" />
              <span>1800-0000-0000 (Toll Free)</span>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;