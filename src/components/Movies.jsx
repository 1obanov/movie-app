import React from "react";
import { Movie } from "./Movie";
import error from "../assets/ico-error.svg";

const getYear = (year) => {
    return year.split('-')[0];
};

function Movies(props) {
  const { media = [] } = props;

  return (
    <div className={media.length ? "movies" : "movies no-results"}>
      {media.length ? (
        media.map((media) => (
          <Movie
            key={media.id}
            id={media.id}
            title={media.title}
            poster={media.poster_path}
            year={getYear(media.release_date)}
            genres={media.genre_names}
            rating={media.vote_average}
          />
        ))
      ) : (
        <div className="error">
          <div className="error__icon">
            <div className="circle">
              <span className="circle-small"></span>
              <span className="circle-medium"></span>
              <span className="circle-large"></span>
            </div>
            <img src={error} alt="error icon"/>
          </div>
          <div className="error__content">
            <h4>No results found</h4>
            <p>
              We couldn't find what you searched for. <br />
              Try searching again
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export { Movies };
