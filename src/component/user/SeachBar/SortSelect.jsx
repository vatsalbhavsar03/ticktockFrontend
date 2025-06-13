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

const sortOptions = [
    { value: "", label: "Sort By" },
    { value: "lowtohigh", label: "Price: Low to High" },
    { value: "hightolow", label: "Price: High to Low" },
];

const SortSelect = ({ onSortChange }) => {
    return (
        <Select
            options={sortOptions}
            defaultValue={sortOptions[0]}
            styles={customStyles}
            onChange={(selected) => onSortChange(selected.value)}
        />
    );
};

export default SortSelect;
