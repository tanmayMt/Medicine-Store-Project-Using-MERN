import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Helmet } from "react-helmet";
import { FiLink, FiCheck, FiX, FiSettings, FiExternalLink } from "react-icons/fi";

const Integrations = () => {
  const [integrations, setIntegrations] = useState([
    {
      id: 1,
      name: "Payment Gateway",
      description: "Connect with Stripe, PayPal, and other payment processors",
      icon: "💳",
      status: "connected",
      connectedService: "Stripe"
    },
    {
      id: 2,
      name: "Email Service",
      description: "Send transactional emails and newsletters",
      icon: "📧",
      status: "connected",
      connectedService: "SendGrid"
    },
    {
      id: 3,
      name: "Analytics",
      description: "Track store performance and customer behavior",
      icon: "📊",
      status: "not_connected",
      connectedService: null
    },
    {
      id: 4,
      name: "Shipping Provider",
      description: "Integrate with shipping carriers for order fulfillment",
      icon: "🚚",
      status: "not_connected",
      connectedService: null
    },
    {
      id: 5,
      name: "Inventory Management",
      description: "Sync inventory across multiple channels",
      icon: "📦",
      status: "not_connected",
      connectedService: null
    },
    {
      id: 6,
      name: "Customer Support",
      description: "Connect with support tools and live chat",
      icon: "💬",
      status: "not_connected",
      connectedService: null
    }
  ]);

  const toggleIntegration = (id) => {
    setIntegrations(integrations.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === "connected" ? "not_connected" : "connected",
            connectedService: integration.status === "connected" ? null : "Connected Service"
          }
        : integration
    ));
  };

  return (
    <>
      <Helmet>
        <title>Integrations - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Integrations</h1>
              <p className="text-sm text-gray-600 mt-1">Connect your store with third-party services</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{integration.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                        {integration.status === "connected" && integration.connectedService && (
                          <p className="text-xs text-gray-500 mt-1">{integration.connectedService}</p>
                        )}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      integration.status === "connected"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {integration.status === "connected" ? (
                        <>
                          <FiCheck className="w-3 h-3" />
                          <span>Connected</span>
                        </>
                      ) : (
                        <>
                          <FiX className="w-3 h-3" />
                          <span>Not Connected</span>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{integration.description}</p>

                  <div className="flex items-center gap-2">
                    {integration.status === "connected" ? (
                      <>
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiSettings className="w-4 h-4" />
                          <span>Configure</span>
                        </button>
                        <button
                          onClick={() => toggleIntegration(integration.id)}
                          className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          Disconnect
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleIntegration(integration.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                      >
                        <FiLink className="w-4 h-4" />
                        <span>Connect</span>
                      </button>
                    )}
                    <button className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <FiExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <FiLink className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">About Integrations</h3>
                  <p className="text-sm text-blue-800 mb-3">
                    Integrations allow you to connect your store with external services to enhance functionality, 
                    automate processes, and provide better customer experiences. Each integration can be configured 
                    individually to meet your specific needs.
                  </p>
                  <p className="text-sm text-blue-800">
                    Need help setting up an integration? Contact our support team for assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Integrations;


