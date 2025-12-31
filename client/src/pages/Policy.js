import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title={"Privacy Policy"}>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-[70vh] px-4 md:px-12 py-8 gap-8 md:gap-10">
        
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="/images/contactus.jpeg"
            alt="privacy policy"
            className="w-full max-w-sm md:max-w-md rounded-lg shadow-lg object-cover"
          />
        </div>

        {/* Policy Text Section */}
        <div className="w-full md:w-1/2 text-gray-700">
          <h1 className="text-2xl md:text-3xl font-bold bg-gray-900 text-white p-3 text-center rounded mb-6">
            PRIVACY POLICY
          </h1>
          <div className="space-y-3 text-justify leading-relaxed text-sm md:text-base">
            <p>1. <strong>Information Collection:</strong> We collect personal information you provide when you register or make a purchase.</p>
            <p>2. <strong>Data Usage:</strong> Your data is used solely to process orders and improve your shopping experience.</p>
            <p>3. <strong>Security:</strong> We implement standard security measures to protect your personal information.</p>
            <p>4. <strong>Third Parties:</strong> We do not sell or trade your personally identifiable information to outside parties.</p>
            <p>5. <strong>Cookies:</strong> Our site uses cookies to enhance your user experience.</p>
            <p>6. <strong>Consent:</strong> By using our site, you consent to our privacy policy.</p>
            <p>7. <strong>Updates:</strong> Any changes to our privacy policy will be posted on this page.</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;