import React, { useEffect, useState } from "react";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Helmet } from "react-helmet";
import { FiX, FiEdit, FiTrash2, FiTag, FiPlus } from "react-icons/fi";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/v1/category/create-category`, {
        name,
      });
      if (data?.success) {
        toast.success(`${name} is created`);
        setName("");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/v1/category/get-category`);
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }
      );
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (pId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const { data } = await axios.delete(
          `${process.env.REACT_APP_API_BASE_URL}/api/v1/category/delete-category/${pId}`
        );
        if (data.success) {
          toast.success("Category deleted successfully");
          getAllCategory();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Category Management - Admin Dashboard</title>
      </Helmet>
      <div className="flex min-h-screen bg-gray-50">
        <AdminMenu />
        
        <div className="flex-1 ml-0 lg:ml-64">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
            <p className="text-sm text-gray-600 mt-1">Create and manage product categories</p>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Create Category Form */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiPlus className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-semibold text-gray-800">Create New Category</h2>
                </div>
                <CategoryForm
                  handleSubmit={handleSubmit}
                  value={name}
                  setValue={setName}
                />
              </div>

              {/* Categories List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FiTag className="w-5 h-5 text-orange-500" />
                  <h2 className="text-xl font-semibold text-gray-800">All Categories</h2>
                  <span className="ml-auto px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                    {categories.length}
                  </span>
                </div>
                
                {categories.length === 0 ? (
                  <div className="text-center py-12">
                    <FiTag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No categories found</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {categories.map((c) => (
                      <div
                        key={c._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{c.name}</span>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                            title="Edit"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            onClick={() => handleDelete(c._id)}
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {visible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-800">Edit Category</h2>
                  <button
                    onClick={() => {
                      setVisible(false);
                      setSelected(null);
                      setUpdatedName("");
                    }}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6">
                  <CategoryForm
                    value={updatedName}
                    setValue={setUpdatedName}
                    handleSubmit={handleUpdate}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateCategory;
