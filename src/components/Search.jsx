import { useState, useEffect } from "react";
import SVG from "react-inlinesvg";
import searchBtn from "../assets/ico-search.svg";

function Search(props) {
  const { searchMovies, searchValue } = props;
  const [value, setValue] = useState(searchValue);

  // Handles the "Enter" key press event; triggers the search if the input value is not empty
  const handleKey = (event) => {
    if (event.key === "Enter" && value.trim()) {
      handleOnClick();
    }
  };

  // Handles the click event for the search button; triggers the search if the input value is not empty
  const handleOnClick = () => {
    if (value.trim()) {
      searchMovies(value);
    }
  };

  // Effect to update the input value whenever `searchValue` prop changes
  useEffect(() => {
    setValue(searchValue);
  }, [searchValue]);

  return (
    <div className="search">
      <input
        placeholder="Search"
        type="search"
        className="validate"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKey}
      />
      <button className="search__btn" onClick={handleOnClick}>
        <SVG src={searchBtn} width={20} height={20} />
      </button>
    </div>
  );
}

export { Search };
