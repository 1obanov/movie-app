import React from "react";

class MovieList extends React.Component {
  handleOnClick = (event) => {
    const type = event.target.dataset.value;
    const parentLi = event.target.parentElement;
    const listItem = document.querySelectorAll(".movie-list__item");

    listItem.forEach((li) => {
      li.classList.remove("active");
    });
    parentLi.classList.add("active");

    this.props.movieListChange(type);
  };

  render() {
    return (
      <>
        <ul className="movie-list">
          <li className="movie-list__item active">
            <button data-value="popular" onClick={this.handleOnClick}>
              Popular
            </button>
          </li>
          <li className="movie-list__item">
            <button data-value="now_playing" onClick={this.handleOnClick}>
              Now Playing
            </button>
          </li>
          <li className="movie-list__item">
            <button data-value="top_rated" onClick={this.handleOnClick}>
              Top Rated
            </button>
          </li>
          <li className="movie-list__item">
            <button data-value="upcoming" onClick={this.handleOnClick}>
              Upcoming
            </button>
          </li>
        </ul>
      </>
    );
  }
}

export { MovieList };
