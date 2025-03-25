import { Movie } from "./Movie";
import { NoResults } from "./NoResults";

function Movies(props) {
  const { media = [], capitalizeWords, checkRating } = props;

  return (
    <div className={media.length ? "movies" : "movies no-results"}>
      {media.length ? (
        media.map((media) => (
          <Movie
            key={media.id}
            id={media.id}
            title={media.title}
            poster={media.poster_path}
            year={media.release_date}
            genres={media.genre_names}
            rating={media.vote_average}
            capitalizeWords={capitalizeWords}
            checkRating={checkRating}
          />
        ))
      ) : (
        <NoResults />
      )}
    </div>
  );
}

export { Movies };
