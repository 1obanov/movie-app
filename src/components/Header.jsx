import { Link } from "react-router-dom";
import { Search } from "./Search";

function Header(props) {
  const { searchMovies, searchValue, resetSearchAndFilters } = props;

  return (
    <header>
      <div className="container">
        <Link to={`/`} onClick={resetSearchAndFilters} className="logo">
          MOVIE <span>app</span>
        </Link>
        <Search searchMovies={searchMovies} searchValue={searchValue} />
      </div>
    </header>
  );
}

export { Header };
