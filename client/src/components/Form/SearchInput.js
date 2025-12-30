import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SearchInput = () => {
  const [values, setValues] = useSearch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/v1/product/search/${values.keyword}`
      );
      setValues({ ...values, results: data });
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full">
      <form
        className="flex items-center w-full relative"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 border-none rounded-full px-4 py-2.5 pr-12 outline-none bg-white text-gray-700 placeholder-gray-400 shadow-sm focus:shadow-md transition-shadow w-full"
          type="search"
          placeholder="Search Your Product..."
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          className="absolute right-2 bg-transparent border-none cursor-pointer p-2 hover:opacity-80 transition-opacity"
          type="submit"
          aria-label="Search"
        >
          <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
