import { useState } from "react";
import { IoSearchOutline } from "react-icons/io5"; // IoSearchOutline is from react-icons
import "./searchbar.css";

const SearchBar = () => {
  return (
    <div className="search-container">
      <input type="text" placeholder="Search..." />
      <IoSearchOutline className="search-icon" />
    </div>
  );
};

export default SearchBar;
