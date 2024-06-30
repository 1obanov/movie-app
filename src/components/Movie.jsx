import React from "react";
import SVG from "react-inlinesvg";
import star from "../assets/ico-star.svg";
import placeholder from "../assets/ico-placeholder.svg";

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function Movie(props) {
  const { id, title, poster, year, genres, rating } = props;
  return (
    <div className="movie" movie-id={id}>
      <div className="card">
        <div className="card__img">
          {poster === null ? (
            <SVG src={placeholder} />
          ) : (
            <img src={`https://image.tmdb.org/t/p/w780${poster}`}></img>
          )}
        </div>
        <div className="card__title">
          <h6 className="title">{capitalizeWords(title)}</h6>
        </div>
        <div className="card__info">
          {/* <p>{genres.join(", ")}</p> */}
          {/* <span>{year}</span> */}
          <span>
            <SVG src={star} />
            {rating.toFixed(0) == 0 ? 'Not rated yet' : rating.toFixed(1)}
          </span>
        </div>
      </div>
    </div>
  );
}

export { Movie };
