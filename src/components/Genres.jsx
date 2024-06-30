import React from "react";

class Genres extends React.Component {
  handleSelect = (event) => {
    this.props.removeActiveClassMovieList();
    const genreId = event.target.value === "all" ? '' : event.target.value;
    this.props.onGenreChange(genreId);
  };

  GenreSelect = () => {
    const { genres, defaultGenre } = this.props;
    const genreOptions = Object.keys(genres).map((id) => ({
      id: id,
      name: genres[id],
    }));

    return (
      <>
        <select id="genre" value={defaultGenre} onChange={this.handleSelect}>
          <option key="all" value="all">
            All genres
          </option>
          {genreOptions.map((genre) => (
            <option key={genre.id} value={genre.id}>
              {genre.name}
            </option>
          ))}
        </select>
      </>
    );
  };

  render() {
    return <div className="filters__group">{this.GenreSelect()}</div>;
  }
}

export { Genres };
