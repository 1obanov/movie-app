import { Movies } from "../components/Movies";
import { Genres } from "../components/Genres";
import { SortBy } from "../components/SortBy";
import { MovieList } from "../components/MovieList";
import { Pagination } from "../components/Pagination";
import { Preloader } from "../components/Preloader";

function Home(props) {
  const {
    selectedGenreId,
    genres,
    onGenreChange,
    sortBy,
    sortByChange,
    movieListChange,
    movieList,
    media,
    page,
    totalPages,
    handlePageChange,
    loading,
    resetSearch,
    capitalizeWords,
    checkRating,
  } = props;

  return (
    <>
      <div className="wrapper container">
        <div className="content">
          <div className="movie-nav">
            <div className="filters">
              <Genres
                selectedGenreId={selectedGenreId}
                genres={genres}
                onGenreChange={onGenreChange}
                resetSearch={resetSearch}
              />
              <SortBy
                sortBy={sortBy}
                sortByChange={sortByChange}
                resetSearch={resetSearch}
              />
            </div>
            <MovieList
              movieListChange={movieListChange}
              movieList={movieList}
            />
          </div>

          {loading ? (
            <Preloader />
          ) : (
            <>
              <Movies
                media={media}
                capitalizeWords={capitalizeWords}
                checkRating={checkRating}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export { Home };
