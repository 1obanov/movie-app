import { Link } from "react-router-dom";

function Footer(props) {
  const { resetSearchAndFilters } = props;

  return (
    <footer>
      <div className="container">
        <Link to={`/`} onClick={resetSearchAndFilters} className="logo">
          MOVIE <span>app</span>
        </Link>
        <div className="copyright">
          <p>
            © {new Date().getFullYear()} All rights reserved. Created by
            <a
              href="https://www.linkedin.com/in/ihor-lobanov/"
              target="_blank"
              rel="noreferrer"
            >
              Ihor Lobanov.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
