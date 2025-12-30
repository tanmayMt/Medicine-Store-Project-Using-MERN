import React, { useState } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { Helmet } from "react-helmet";
import { FiHelpCircle, FiSearch, FiBook, FiMessageCircle, FiMail, FiPhone, FiChevronDown, FiChevronRight } from "react-icons/fi";

const Help = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSection, setExpandedSection] = useState(null);

  const faqCategories = [
    {
      id: 1,
      title: "Getting Started",
      icon: FiBook,
      questions: [
        {
          q: "How do I add a new product?",
          a: "Navigate to Products in the sidebar, then click 'Create Product'. Fill in all required fields including name, description, price, category, and upload product images."
        },
        {
          q: "How do I manage orders?",
          a: "Go to the Orders section to view all orders. You can filter by status, update order status, and view detailed order information."
        },
        {
          q: "How do I create a discount code?",
          a: "Visit the Discounts page and click 'Create Discount'. Enter the discount code, set the discount type (percentage or fixed), and configure the terms."
        }
      ]
    },
    {
      id: 2,
      title: "Product Management",
      icon: FiBook,
      questions: [
        {
          q: "How do I update product information?",
          a: "Go to Products, find the product you want to update, and click the edit button. Make your changes and save."
        },
        {
          q: "How do I manage inventory?",
          a: "Product inventory can be updated in the product edit page. Set the quantity available and enable/disable stock tracking."
        },
        {
          q: "Can I bulk upload products?",
          a: "Currently, products need to be added individually. Bulk upload functionality is coming soon."
        }
      ]
    },
    {
      id: 3,
      title: "Orders & Customers",
      icon: FiBook,
      questions: [
        {
          q: "How do I process an order?",
          a: "In the Orders section, select an order and update its status. You can mark it as processing, shipped, or delivered."
        },
        {
          q: "How do I view customer information?",
          a: "Go to Customers to see all registered users. Click on a customer to view their details, order history, and contact information."
        },
        {
          q: "How do I handle refunds?",
          a: "Refunds can be processed through the order details page. Contact your payment processor for specific refund procedures."
        }
      ]
    },
    {
      id: 4,
      title: "Settings & Configuration",
      icon: FiBook,
      questions: [
        {
          q: "How do I change store settings?",
          a: "Navigate to Settings to update store information, payment methods, shipping options, and other configurations."
        },
        {
          q: "How do I set up integrations?",
          a: "Go to Integrations and click 'Connect' on any service you want to integrate. Follow the setup instructions for each service."
        },
        {
          q: "How do I manage user roles?",
          a: "User roles and permissions can be configured in the Settings section under User Management."
        }
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <Helmet>
        <title>Help & Support - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center justify-between sticky top-0 z-10 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Help & Support</h1>
              <p className="text-sm text-gray-600 mt-1">Find answers and get assistance</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <FiBook className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Documentation</h3>
                <p className="text-sm text-gray-600">Browse our guides</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <FiMessageCircle className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Live Chat</h3>
                <p className="text-sm text-gray-600">Chat with support</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow cursor-pointer">
                <FiMail className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Email Support</h3>
                <p className="text-sm text-gray-600">support@medicure.com</p>
              </div>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              {filteredCategories.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-100">
                  <FiHelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">No results found for your search</p>
                </div>
              ) : (
                filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                      <button
                        onClick={() => toggleSection(category.id)}
                        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-orange-500" />
                          <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                        </div>
                        {expandedSection === category.id ? (
                          <FiChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <FiChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedSection === category.id && (
                        <div className="px-6 pb-6 space-y-4">
                          {category.questions.map((item, index) => (
                            <div key={index} className="border-l-4 border-orange-500 pl-4">
                              <h4 className="font-semibold text-gray-900 mb-2">{item.q}</h4>
                              <p className="text-sm text-gray-600">{item.a}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Contact Section */}
            <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <FiHelpCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-orange-900 mb-2">Still need help?</h3>
                  <p className="text-sm text-orange-800 mb-4">
                    Our support team is here to help you. Reach out through any of the following channels:
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <a href="mailto:support@medicure.com" className="flex items-center gap-2 text-sm text-orange-800 hover:text-orange-900">
                      <FiMail className="w-4 h-4" />
                      <span>support@medicure.com</span>
                    </a>
                    <a href="tel:+1234567890" className="flex items-center gap-2 text-sm text-orange-800 hover:text-orange-900">
                      <FiPhone className="w-4 h-4" />
                      <span>+1 (234) 567-890</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Help;

