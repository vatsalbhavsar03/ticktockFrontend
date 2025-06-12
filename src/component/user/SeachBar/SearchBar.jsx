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


// import { useState } from "react";
// import { IoSearchOutline } from "react-icons/io5";
// import "./searchbar.css";

// const SearchBar = ({ onSortChange }) => {
//     const [sort, setSort] = useState("");

//     const handleSort = (value) => {
//         setSort(value);
//         onSortChange(value);
//     };

//     return (
//         <div className="search-container">
//             <select
//                 value={sort}
//                 onChange={(e) => handleSort(e.target.value)}
//                 className="sort-dropdown"
//                 style={{
//                     border: "none",
//                     height: "36px",
//                     borderRadius: "5px",
//                     backgroundColor: "#f4f4f4",
//                     padding: "0 10px"
//                 }}
//             >
//                 <option value="">Sort By</option>
//                 <option value="lowtohigh">Price: Low to High</option>
//                 <option value="hightolow">Price: High to Low</option>
//             </select>
//             <IoSearchOutline className="search-icon" />
//         </div>
//     );
// };

// export default SearchBar;
