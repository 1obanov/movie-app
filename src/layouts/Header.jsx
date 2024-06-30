import { Search } from "../components/Search";

function Header(props) {
  const { search, searchMovies, updateSearch, removeActiveClassMovieList } =
    props;
  return (
    <header>
      <div className="container">
        <a href="" className="logo">
          MOVIE <span>app</span>
        </a>
        <Search
          search={search}
          searchMovies={searchMovies}
          updateSearch={updateSearch}
          removeActiveClassMovieList={removeActiveClassMovieList}
        />
      </div>
    </header>
  );
}

export { Header };
