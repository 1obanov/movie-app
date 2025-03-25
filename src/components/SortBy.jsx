function SortBy(props) {
  const { sortBy, sortByChange, resetSearch } = props;

  // Handles the sorting change event; resets the search and triggers sorting based on the selected value
  const handleSortBy = (event) => {
    resetSearch();
    sortByChange(event.target.value);
  };

  return (
    <div className="filters__group">
      <select id="sort" value={sortBy} onChange={handleSortBy}>
        <option value="popularity.desc">Popularity Descending</option>
        <option value="popularity.asc">Popularity Ascending</option>
        <option value="vote_average.desc">Rating Descending</option>
        <option value="vote_average.asc">Rating Ascending</option>
        <option value="primary_release_date.desc">
          Release Date Descending
        </option>
        <option value="primary_release_date.asc">Release Date Ascending</option>
        <option value="title.asc">Title (A-Z)</option>
        <option value="title.desc">Title (Z-A)</option>
      </select>
    </div>
  );
}

export { SortBy };
