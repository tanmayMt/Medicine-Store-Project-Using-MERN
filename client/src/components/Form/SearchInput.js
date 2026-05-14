import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

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
        className="group relative flex w-full items-center rounded-full border border-slate-200/90 bg-white/90 shadow-sm shadow-slate-900/[0.04] ring-1 ring-slate-900/[0.03] transition focus-within:border-sky-300 focus-within:shadow-md focus-within:ring-2 focus-within:ring-sky-500/20"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="min-h-[44px] w-full flex-1 rounded-full border-0 bg-transparent py-2.5 pl-4 pr-12 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          type="search"
          placeholder="Search medicines & health products…"
          aria-label="Search products"
          value={values.keyword}
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}
        />
        <button
          className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-sky-600 text-white transition hover:bg-sky-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          type="submit"
          aria-label="Submit search"
        >
          <FiSearch className="h-4 w-4" strokeWidth={2.25} />
        </button>
      </form>
    </div>
  );
};

export default SearchInput;
