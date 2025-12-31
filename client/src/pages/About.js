import React from "react";
import Layout from "./../components/Layout/Layout";

const About = () => {
  return (
    <Layout title={"About us - Medicure"}>
      <div className="flex flex-col md:flex-row gap-10 items-center justify-center min-h-[70vh] px-4 md:px-12 py-8">
        {/* Left Column: Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/about.jpeg"
            alt="about us"
            className="w-full max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Right Column: Content */}
        <div className="w-full md:w-1/2 text-gray-700">
          <h1 className="text-3xl font-bold bg-gray-900 text-white p-3 text-center rounded mb-6">
            ABOUT US
          </h1>
          <p className="text-justify leading-relaxed text-lg">
            Welcome to Medicure, your trusted partner in health and wellness. 
            We are dedicated to providing high-quality medicines and healthcare products 
            accessible to everyone. Our mission is to bridge the gap between 
            pharmacies and patients through technology, ensuring fast delivery, 
            genuine products, and exceptional customer service. Whether you need 
            prescription medications or general wellness products, we are here to serve you 24/7.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default About;