import React from "react";
// import { Theme } from "./components/Theme";
import { Header } from "./layouts/Header";
import { Footer } from "./layouts/Footer";
import { Main } from "./layouts/Main";
import { Movies } from "./components/Movies";
import { Genres } from "./components/Genres";
import { SortBy } from "./components/SortBy";
import { MovieList } from "./components/MovieList";
import { Preloader } from "./components/Preloader";
import SVG from "react-inlinesvg";
import prev from "./assets/ico-prev.svg";
import next from "./assets/ico-next.svg";

const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// document.body.setAttribute('data-theme', localStorage.getItem('theme') === 'light' ? 'light' : 'dark');

export class App extends React.Component {
  state = {
    loading: true,
    // theme: localStorage.getItem("theme") === "light" ? "light" : "dark",
    media: [],
    movieList: "popular",
    genres: {},
    defaultGenre: "all",
    search: "",
    // search: localStorage.getItem('search') !== null ? localStorage.getItem('search') : '',
    page: 1,
    totalPages: 0,
    selectedGenreId: null,
    sortBy: null,
    defaultSortBy: "popularity.desc",
  };

  componentDidMount() {
    this.fetchGenres().then(() => {
      this.fetchMedia();
    });
  }

  fetchGenres = () => {
    return fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((moviesResult) => {
        const genres = {};
        moviesResult.genres.forEach((genre) => {
          genres[genre.id] = genre.name;
        });
        this.setState({ genres });
      })
      .catch((error) => {
        console.error("Error fetching genres:", error);
      });
  };

  fetchMedia = () => {
    let { page, search, selectedGenreId, sortBy, movieList } = this.state;
    let url;

    if (search !== "" && selectedGenreId === null && sortBy === null) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&page=${page}&query=${search}`;
    } else if (selectedGenreId || sortBy) {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&with_genres=${
        selectedGenreId === null ? "" : selectedGenreId
      }&sort_by=${sortBy === null ? "" : sortBy}`;
    } else {
      url = `${BASE_URL}/movie/${movieList}?api_key=${API_KEY}&page=${page}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((moviesResult) => {
        const { genres } = this.state;
        const movies = moviesResult.results.map((movie) => ({
          ...movie,
          genre_names: movie.genre_ids
            .map((id) => genres[id])
            .filter((name) => name),
        }));
        this.setState({
          media: movies,
          loading: false,
          totalPages:
            moviesResult.total_pages > 500 ? 500 : moviesResult.total_pages,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        this.setState({
          loading: false,
        });
      });
  };

  handleMovieListChange = (typeList) => {
    this.setState(
      {
        loading: true,
        page: 1,
        movieList: typeList,
        search: "",
        selectedGenreId: null,
        defaultGenre: "all",
        sortBy: null,
        defaultSortBy: "popularity.desc",
      },
      () => {
        this.fetchMedia();
      }
    );
  };

  removeActiveClassMovieList = () => {
    const lis = document.querySelectorAll(".movie-list__item");
    lis.forEach((li) => {
      li.classList.remove("active");
    });
  };

  updateSearch = (str) => {
    this.setState({
      search: str,
    });
  };

  searchMovies = (str) => {
    let typeList;
    if (str !== "") {
      typeList = null;
    } else {
      typeList = "popular";

      const listItem = document.querySelectorAll(".movie-list__item");
      listItem.forEach((li) => {
        const button = li.querySelector("button");
        if (button && button.dataset.value === "popular") {
          li.classList.add("active");
        }
      });
    }

    // if(str !== '') {
    //   localStorage.setItem("search", str);
    // } else {
    //   localStorage.removeItem("search");
    // }

    this.setState(
      {
        loading: true,
        page: 1,
        search: str,
        selectedGenreId: null,
        defaultGenre: "all",
        sortBy: null,
        defaultSortBy: "popularity.desc",
        movieList: typeList,
      },
      () => {
        this.fetchMedia();
      }
    );
  };

  handleGenreChange = (genreId) => {
    let typeList;
    if (genreId !== null) {
      typeList = null;
    } else {
      typeList = "popular";

      const listItem = document.querySelectorAll(".movie-list__item");
      listItem.forEach((li) => {
        const button = li.querySelector("button");
        if (button && button.dataset.value === "popular") {
          li.classList.add("active");
        }
      });
    }

    this.setState(
      {
        loading: true,
        page: 1,
        selectedGenreId: genreId,
        defaultGenre: genreId,
        search: "",
        movieList: typeList,
      },
      () => {
        this.fetchMedia();
      }
    );
  };

  handleSortByChange = (sort) => {
    this.setState(
      {
        loading: true,
        page: 1,
        sortBy: sort,
        defaultSortBy: sort,
        search: "",
        movieList: null,
      },
      () => {
        this.fetchMedia();
      }
    );
  };

  handlePageChange = (page) => {
    if (page < 1 || page > 500) return; // Ensure the page is within the allowed range
    window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top of the page
    this.setState({
      loading: true,
      page: page,
    }, () => {
      this.fetchMedia();
    });
  };

  // handleChangeTheme = (theme) => {
  //   document.body.setAttribute('data-theme', theme);
  //   this.setState({
  //     theme: theme,
  //   });
  // };

  renderPagination = () => {
    const { page, totalPages } = this.state;
    const pagesToShow = 3; // Number of pages to show in pagination

    // If there's only one page, don't render the pagination component
    if (totalPages <= 1) {
      return null;
    }

    // Calculate start and end page numbers based on current page
    let startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
    let endPage = startPage + pagesToShow - 1;

    // Adjust startPage and endPage if endPage exceeds totalPages
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - pagesToShow + 1);
    }

    // Generate an array of page numbers to display
    const pageNumbers = [...Array(endPage - startPage + 1).keys()].map(
      (i) => startPage + i
    );

    return (
      <ul className="pagination">
        <li className={`${page <= 1 ? "disabled" : ""}`}>
          <button
            onClick={() => this.handlePageChange(page - 1)}
            disabled={page <= 1}
          >
            <SVG src={prev} />
          </button>
        </li>
        {startPage > 1 && page > 2 && (
          <>
            <li>
              <button onClick={() => this.handlePageChange(1)}>1</button>
            </li>
            {startPage > 2 && (
              <li className="ellipsis disabled">
                <button>...</button>
              </li>
            )}
          </>
        )}
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`${page === pageNumber ? "active" : ""}`}
          >
            <button onClick={() => this.handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          </li>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="ellipsis disabled">
                <button>...</button>
              </li>
            )}
            <li>
              <button onClick={() => this.handlePageChange(totalPages)}>
                {totalPages}
              </button>
            </li>
          </>
        )}
        <li className={`${page >= totalPages ? "disabled" : ""}`}>
          <button
            onClick={() => this.handlePageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <SVG src={next} />
          </button>
        </li>
      </ul>
    );
  };

  render() {
    const {
      media,
      genres,
      loading,
      theme,
      defaultGenre,
      defaultSortBy,
      search,
    } = this.state;

    return (
      <>
        <Header
          search={search}
          searchMovies={this.searchMovies}
          updateSearch={this.updateSearch}
          removeActiveClassMovieList={this.removeActiveClassMovieList}
        />
        <main data-theme={theme} className="main">
          {/* <Theme theme={theme} changeTheme={this.handleChangeTheme}/> */}
          <div className="wrapper container">
            <div className="content">
              <div className="movie-nav">
                <div className="filters">
                  <Genres
                    defaultGenre={defaultGenre}
                    genres={genres}
                    onGenreChange={this.handleGenreChange}
                    removeActiveClassMovieList={this.removeActiveClassMovieList}
                  />
                  <SortBy
                    defaultSortBy={defaultSortBy}
                    sortByChange={this.handleSortByChange}
                    removeActiveClassMovieList={this.removeActiveClassMovieList}
                  />
                </div>
                <MovieList movieListChange={this.handleMovieListChange} />
              </div>

              {loading ? (
                <Preloader />
              ) : (
                <>
                  <Movies media={media} />
                  {this.renderPagination()}
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
}

export default App;
