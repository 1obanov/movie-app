import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="section 404-page">
      <div className="container">
        <div className="headline headline--mb-0">
          <h2 className="headline__title">Error Page</h2>
          <p className="headline__subtitle">
            The page you are looking for doesn't exist. It may have been moved
            or removed altogether. Please try searching for some other page, or
            return to the website's homepage to find what you're looking for.
          </p>
          <Link to="/" className="btn">
            <span>Back to home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export { NotFound };
