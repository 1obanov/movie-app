import { useState, useEffect } from "react";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { MOVIE_APP_API_URL, MOVIE_APP_API_KEY } from "../config";

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Home } from "../pages/Home";
import { NotFound } from "../pages/NotFound";
import { MovieDetails } from "../pages/MovieDetails";

// Function to capitalize the first letter of each word in a string
const capitalizeWords = (str) => {
  if (str !== undefined) {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  } else {
    return "Title is not available";
  }
};

// Function to format a numeric rating to one decimal place
const checkRating = (rating) => {
  if (rating !== undefined) {
    return rating.toFixed(0) === 0 ? "Not rated yet" : rating.toFixed(1);
  } else {
    return "Rating is not available";
  }
};

function Main() {
  const { pathname, search } = useLocation();
  const { push } = useHistory();

  const [loading, setLoading] = useState(true);
  const [media, setMedia] = useState([]);
  const [genres, setGenres] = useState({});
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [movieList, setMovieList] = useState(() => {
    const urlParams = new URLSearchParams(search);
    const hasRelevantParams = ["search", "genre", "sort"].some((param) =>
      urlParams.has(param)
    );
    return hasRelevantParams ? null : urlParams.get("movielist");
  });
  const [selectedGenreId, setSelectedGenreId] = useState(() => {
    const urlGenre = new URLSearchParams(search).get("genre");
    return urlGenre ? parseInt(urlGenre) : "";
  });
  const [sortBy, setSortBy] = useState(() => {
    const urlSort = new URLSearchParams(search).get("sort");
    return urlSort ? urlSort : "popularity.desc";
  });

  // Fetch genre data from the API
  const fetchGenres = async () => {
    try {
      const response = await fetch(
        `${MOVIE_APP_API_URL}/genre/movie/list?api_key=${MOVIE_APP_API_KEY}`
      );
      const { genres: genreList } = await response.json();

      const genres = genreList.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});

      setGenres(genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchMedia = async () => {
    try {
      let url;

      // Determine the URL based on the provided filters and conditions
      if (searchValue && !selectedGenreId && !sortBy && !movieList) {
        url = `${MOVIE_APP_API_URL}/search/movie?api_key=${MOVIE_APP_API_KEY}&page=${page}&query=${searchValue}`;
      } else if (selectedGenreId || sortBy) {
        url = `${MOVIE_APP_API_URL}/discover/movie?api_key=${MOVIE_APP_API_KEY}&page=${page}&with_genres=${
          selectedGenreId || ""
        }&sort_by=${sortBy || ""}`;
      } else if (movieList && !searchValue && !selectedGenreId && !sortBy) {
        url = `${MOVIE_APP_API_URL}/movie/${movieList}?api_key=${MOVIE_APP_API_KEY}&page=${page}`;
      } else {
        return;
      }

      // Fetch media data from the API
      const response = await fetch(url);
      const moviesResult = await response.json();

      // Transform the results to include genre names
      const movies = moviesResult.results.map((movie) => ({
        ...movie,
        genre_names:
          movie.genre_ids?.map((id) => genres[id]).filter(Boolean) || [],
      }));

      setMedia(movies);
      setLoading(false);
      setTotalPages(Math.min(moviesResult.total_pages, 500));
    } catch (error) {
      console.error("Error fetching movies:", error);
      setLoading(false);
    }
  };

  // Removes a list of parameters from a URLSearchParams object
  const deleteParams = (params, paramsName) => {
    params.forEach((param) => paramsName.delete(param));
  };

  // Handles the change of movie list type by updating the state and URL parameters
  const handleMovieListChange = (typeList) => {
    setPage(1);
    setMovieList(typeList);
    setSelectedGenreId("");
    setSortBy("");

    const movieListParams = new URLSearchParams(search);
    deleteParams(["search", "genre", "sort", "page"], movieListParams);
    movieListParams.set("movielist", typeList);

    push({ search: movieListParams.toString() });
  };

  // Updates the state and URL parameters when performing a movie search
  const searchMovies = (str) => {
    setSearchValue(str);
    setPage(1);
    setSelectedGenreId("");
    setSortBy("");
    setMovieList(null);

    const searchParams = new URLSearchParams(search);
    deleteParams(["genre", "sort", "movielist"], searchParams);
    searchParams.set("search", str);
    searchParams.set("page", 1);

    push({
      pathname: pathname !== "/" ? "/" : undefined,
      search: searchParams.toString(),
    });
  };

  // Handles changes to the selected genre by updating the state and URL parameters
  const handleGenreChange = (genreId) => {
    setPage(1);
    setSelectedGenreId(genreId);
    setMovieList(genreId === "" ? "popular" : null);

    const genreParams = new URLSearchParams(search);
    deleteParams(["search", "page", "movielist"], genreParams);

    // Set or remove the genre filter based on the selected genre
    genreId ? genreParams.set("genre", genreId) : genreParams.delete("genre");

    push({ search: genreParams.toString() });
  };

  // Handles sorting changes by updating the state and URL parameters
  const handleSortByChange = (sort) => {
    setPage(1);
    setSortBy(sort);
    setMovieList(null);

    const sortParams = new URLSearchParams(search);
    deleteParams(["search", "page", "movielist"], sortParams);

    // Update or remove the sort parameter based on the selected sort option
    sort === "popularity.desc"
      ? sortParams.delete("sort")
      : sortParams.set("sort", sort);

    push({ search: sortParams.toString() });
  };

  // Handles page change by updating the state and URL parameters
  const handlePageChange = (page) => {
    if (page < 1 || page > 500) return;

    window.scrollTo({ top: 0, behavior: "smooth" });

    setPage(page);

    const searchParams = new URLSearchParams(search);
    searchParams.set("page", page);

    push({ search: searchParams.toString() });
  };

  // Resets all search and filters to their default values
  const resetSearchAndFilters = () => {
    setSearchValue("");
    setMovieList("popular");
    setSelectedGenreId("");
    setSortBy("");
    setPage(1);
  };

  // Resets the search input and clears the search query from the URL
  const resetSearch = () => {
    setSearchValue("");
    push({ search: "" });
  };

  // useEffect to fetch the list of genres when the component is mounted
  useEffect(() => {
    fetchGenres();
  }, []);

  // Synchronizes state with URL parameters and triggers a media fetch whenever the URL changes on the home page.
  useEffect(() => {
    setLoading(true);

    if (pathname === "/") {
      const urlParams = new URLSearchParams(search);
      const hasRelevantParams = ["search", "genre", "sort"].some((param) =>
        urlParams.has(param)
      );

      setSearchValue(urlParams.get("search") || "");
      setPage(parseInt(urlParams.get("page")) || 1);
      setSelectedGenreId(parseInt(urlParams.get("genre")) || "");
      setSortBy(urlParams.get("sort") || "");
      setMovieList(
        hasRelevantParams ? null : urlParams.get("movielist") || "popular"
      );
      fetchMedia();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, searchValue, page, selectedGenreId, sortBy, movieList, pathname]);

  return (
    <>
      <Header
        searchMovies={searchMovies}
        searchValue={searchValue}
        resetSearchAndFilters={resetSearchAndFilters}
      />
      <main className="main">
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Home
                selectedGenreId={selectedGenreId}
                genres={genres}
                onGenreChange={handleGenreChange}
                sortBy={sortBy}
                sortByChange={handleSortByChange}
                movieListChange={handleMovieListChange}
                movieList={movieList}
                media={media}
                page={page}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                loading={loading}
                resetSearch={resetSearch}
                capitalizeWords={capitalizeWords}
                checkRating={checkRating}
              />
            )}
          />
          <Route
            exact
            path="/movie/:id"
            render={() => (
              <MovieDetails
                capitalizeWords={capitalizeWords}
                checkRating={checkRating}
              />
            )}
          />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer resetSearchAndFilters={resetSearchAndFilters} />
    </>
  );
}

export { Main };
