import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import "./searchbar.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Call parent search function
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search here "
        value={query}
        onChange={handleChange}
      />
      <IoSearchOutline className="search-icon" />
    </div>
  );
};

export default SearchBar;


