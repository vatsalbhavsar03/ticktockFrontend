import { useEffect, useState } from "react";
import Select from "react-select";

const customStyles = {
    control: (provided) => ({
        ...provided,
        backgroundColor: "#0f3460",
        color: "white",
        borderRadius: "5px",
        border: "none",
        boxShadow: "none",
        width: "200px",
        height: "40px",
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? "#0f3460" : "white",
        color: state.isSelected ? "white" : "#0f3460",
        "&:hover": {
            backgroundColor: "#0f3460",
            color: "white",
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: "white",
    }),
};

const FilterSelect = ({ onCategoryChange, onBrandChange }) => {
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);

    useEffect(() => {
        fetch("https://localhost:7026/api/Products/GetFilterOptions")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setCategoryOptions([{ value: "", label: "All Categories" }, ...data.categories]);
                    setBrandOptions([{ value: "", label: "All Brands" }, ...data.brands]);
                }
            });
    }, []);

    return (
        <div style={{ display: "flex", gap: "10px" }}>
            <Select
                options={categoryOptions}
                defaultValue={{ value: "", label: "All Categories" }}
                styles={customStyles}
                onChange={(selected) => onCategoryChange(selected.value)}
            />
            <Select
                options={brandOptions}
                defaultValue={{ value: "", label: "All Brands" }}
                styles={customStyles}
                onChange={(selected) => onBrandChange(selected.value)}
            />
        </div>
    );
};

export default FilterSelect;
