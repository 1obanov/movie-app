import { Link } from "react-router-dom";
import SVG from "react-inlinesvg";
import star from "../assets/ico-star.svg";
import placeholder from "../assets/ico-placeholder.svg";

function Movie(props) {
  const { capitalizeWords, checkRating, id, title, poster, rating } = props;

  return (
    <div className="movies__item">
      <Link to={`/movie/${id}`} className="card">
        <div className={`card__img ${poster === null ? "no-image" : ""}`}>
          {poster === null ? (
            <SVG src={placeholder} />
          ) : (
            <img
              src={`https://image.tmdb.org/t/p/w780${poster}`}
              alt={capitalizeWords(title)}
            ></img>
          )}
        </div>
        <div className="card__title">
          <h6 className="title">{capitalizeWords(title)}</h6>
        </div>
        <div className="card__info">
          <span>
            <SVG src={star} width={15} height={15} />
            {checkRating(rating)}
          </span>
        </div>
      </Link>
    </div>
  );
}

export { Movie };
