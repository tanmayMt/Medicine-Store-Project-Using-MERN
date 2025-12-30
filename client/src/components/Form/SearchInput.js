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
        className="flex items-center w-full"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="flex-1 border border-gray-300 rounded-none px-3 py-2 outline-none bg-white text-gray-700 placeholder-gray-400"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          className="bg-black text-white rounded-none px-6 py-2 border-0 cursor-pointer relative"
          type="submit"
        >
          <span className="relative z-10">Search</span>
          <span className="absolute right-0 top-0 bottom-0 w-1 bg-green-500"></span>
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
