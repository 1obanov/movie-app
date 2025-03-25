function Genres(props) {
  const { selectedGenreId, genres, onGenreChange, resetSearch } = props;

  // Handles the selection of a genre and triggers the necessary actions
  const handleSelect = (event) => {
    resetSearch();
    const genreId = event.target.value === "all" ? "" : event.target.value;
    onGenreChange(genreId);
  };

  // Maps over the genres object to create an array of genre options
  const genreOptions = Object.keys(genres).map((id) => ({
    id: id,
    name: genres[id],
  }));

  return (
    <div className="filters__group">
      <select id="genre" value={selectedGenreId} onChange={handleSelect}>
        <option key="all" value="all">
          All genres
        </option>
        {genreOptions.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export { Genres };
