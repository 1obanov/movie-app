import { useState, useEffect } from "react";

function MovieList(props) {
  const { movieListChange, movieList } = props;
  const [activeType, setActiveType] = useState(movieList);

  // Handles click events on movie type buttons
  const handleOnClick = (event) => {
    const type = event.target.dataset.value;
    setActiveType(type);
    movieListChange(type);
  };

  // Update active type whenever the movieList prop changes
  useEffect(() => {
    setActiveType(movieList);
  }, [movieList]);

  return (
    <ul className="movie-list">
      <li
        className={`movie-list__item ${
          activeType === "popular" ? "active" : ""
        }`}
      >
        <button data-value="popular" onClick={handleOnClick}>
          Popular
        </button>
      </li>
      <li
        className={`movie-list__item ${
          activeType === "now_playing" ? "active" : ""
        }`}
      >
        <button data-value="now_playing" onClick={handleOnClick}>
          Now Playing
        </button>
      </li>
      <li
        className={`movie-list__item ${
          activeType === "top_rated" ? "active" : ""
        }`}
      >
        <button data-value="top_rated" onClick={handleOnClick}>
          Top Rated
        </button>
      </li>
      <li
        className={`movie-list__item ${
          activeType === "upcoming" ? "active" : ""
        }`}
      >
        <button data-value="upcoming" onClick={handleOnClick}>
          Upcoming
        </button>
      </li>
    </ul>
  );
}

export { MovieList };
