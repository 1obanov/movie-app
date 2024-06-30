import React from "react";
import SVG from "react-inlinesvg";
import searchBtn from "../assets/ico-search.svg";

class Search extends React.Component {
  handleKey = (event) => {
    if (event.key === "Enter") {
      this.props.removeActiveClassMovieList();
      this.props.searchMovies(this.props.search);
    }
  };

  handleOnClick = () => {
    this.props.removeActiveClassMovieList();
    this.props.searchMovies(this.props.search);
  };

  handleChange = (event) => {
    this.props.updateSearch(event.target.value);
  };

  render() {
    const { search } = this.props;
    return (
      <div className="search">
        <input
          placeholder="Search"
          type="search"
          className="validate"
          value={search}
          onChange={this.handleChange}
          onKeyDown={this.handleKey}
        />
        <button className="btn" onClick={this.handleOnClick}>
          <SVG src={searchBtn} />
        </button>
      </div>
    );
  }
}

export { Search };
