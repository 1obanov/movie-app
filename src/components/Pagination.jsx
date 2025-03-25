import SVG from "react-inlinesvg";
import prev from "../assets/ico-prev.svg";
import next from "../assets/ico-next.svg";

const Pagination = ({ page, totalPages, handlePageChange }) => {
  const pagesToShow = 3;

  // If there is only 1 page or no pages, return null (no pagination needed)
  if (totalPages <= 1) {
    return null;
  }

  // Calculate the starting and ending page number for the pagination
  let startPage = Math.max(1, page - Math.floor(pagesToShow / 2));
  let endPage = startPage + pagesToShow - 1;

  // Adjust the start and end page numbers if they exceed the total number of pages
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - pagesToShow + 1);
  }

  // Generate an array of page numbers to be shown
  const pageNumbers = [...Array(endPage - startPage + 1).keys()].map(
    (i) => startPage + i
  );

  return (
    <ul className="pagination">
      <li className={`${page <= 1 ? "disabled" : ""}`}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          <SVG src={prev} width={15} height={15} />
        </button>
      </li>
      {startPage > 1 && page > 2 && (
        <>
          <li>
            <button onClick={() => handlePageChange(1)}>1</button>
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
          {page === pageNumber ? (
            <button disabled>{pageNumber}</button>
          ) : (
            <button onClick={() => handlePageChange(pageNumber)}>
              {pageNumber}
            </button>
          )}
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
            <button onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </button>
          </li>
        </>
      )}
      <li className={`${page >= totalPages ? "disabled" : ""}`}>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <SVG src={next} width={15} height={15} />
        </button>
      </li>
    </ul>
  );
};

export { Pagination };
