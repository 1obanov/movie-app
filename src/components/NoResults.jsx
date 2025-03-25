import error from "../assets/ico-error.svg";

function NoResults() {
  return (
    <div className="error">
      <div className="error__icon">
        <div className="circle">
          <span className="circle-small"></span>
          <span className="circle-medium"></span>
          <span className="circle-large"></span>
        </div>
        <img src={error} alt="error icon" />
      </div>
      <div className="error__content">
        <h4>No results found</h4>
        <p>
          We couldn't find what you searched for. <br />
          Try searching again
        </p>
      </div>
    </div>
  );
}

export { NoResults };
