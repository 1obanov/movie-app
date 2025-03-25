import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MOVIE_APP_API_URL, MOVIE_APP_API_KEY } from "../config";
import languageData from "../languages.json";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";

import { Preloader } from "../components/Preloader";
import Modal from "../components/Modal";

import { NotFound } from "../pages/NotFound";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import SVG from "react-inlinesvg";
import star from "../assets/ico-star.svg";
import play from "../assets/ico-play.svg";
import icoRight from "../assets/ico-arrow-right.svg";
import placeholder from "../assets/ico-placeholder.svg";
import icoAvatar from "../assets/ico-avatar.svg";
import icoIMDb from "../assets/ico-imdb.svg";

function MovieDetails(props) {
  const { capitalizeWords, checkRating } = props;
  const { id } = useParams();

  const [movie, setMovie] = useState({});
  const [trailer, setTrailer] = useState(null);
  const [cast, setCast] = useState(null);
  const [crew, setCrew] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalCastCrewOpen, setModalCastCrewOpen] = useState(false);
  const [modalTrailerOpen, setModalTrailerOpen] = useState(false);

  // Reusable function to toggle modals and manage body overflow
  const toggleModal = (setModalState) => {
    setModalState((prev) => {
      const isOpening = !prev;
      document.body.style.overflow = isOpening ? "hidden" : "";
      return isOpening;
    });
  };

  // Toggles the visibility of the Cast/Crew modal
  const toggleCastCrewModal = () => toggleModal(setModalCastCrewOpen);

  // Toggles the visibility of the Trailer modal
  const toggleTrailerModal = () => toggleModal(setModalTrailerOpen);

  // Formats a vote count into a more readable format
  const checkCount = (voteCount) => {
    return voteCount >= 1000000
      ? `${(voteCount / 1000000).toFixed(0)}M`
      : voteCount >= 1000
      ? `${(voteCount / 1000).toFixed(0)}K`
      : `${Math.floor(voteCount)}`;
  };

  // Extracts the year from a date string in the format "YYYY-MM-DD"
  const getYear = (year) => {
    if (year) {
      return year.split("-")[0];
    }
    return undefined;
  };

  // Formats a date string into a more readable format "DD MM YYYY HH:mm"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-GB", options).replace(",", "");
  };

  // Returns the language name for a given code, or "Unknown" if not found
  const getLanguageName = (code) => languageData[code] || "Unknown";

  // Fetches movie details, videos, credits, similar movies, and reviews based on movie ID
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setLoading(false);
      setMovie(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [movieData, videosData, creditsData, similarData, reviewsData] =
          await Promise.all([
            fetch(
              `${MOVIE_APP_API_URL}/movie/${id}?api_key=${MOVIE_APP_API_KEY}`
            ).then((res) => res.json()),
            fetch(
              `${MOVIE_APP_API_URL}/movie/${id}/videos?api_key=${MOVIE_APP_API_KEY}`
            ).then((res) => res.json()),
            fetch(
              `${MOVIE_APP_API_URL}/movie/${id}/credits?api_key=${MOVIE_APP_API_KEY}`
            ).then((res) => res.json()),
            fetch(
              `${MOVIE_APP_API_URL}/movie/${id}/similar?api_key=${MOVIE_APP_API_KEY}`
            ).then((res) => res.json()),
            fetch(
              `${MOVIE_APP_API_URL}/movie/${id}/reviews?api_key=${MOVIE_APP_API_KEY}`
            ).then((res) => res.json()),
          ]);

        const trailer = videosData.results.find(
          (video) => video.type === "Trailer"
        );

        const combinedCredits = [
          ...creditsData.cast.map((member) => ({ ...member, role: "cast" })),
          ...creditsData.crew.map((member) => ({ ...member, role: "crew" })),
        ];

        setMovie(movieData);
        setTrailer(trailer || null);
        setCast(creditsData.cast);
        setCrew(creditsData.crew);
        setCredits(combinedCredits);
        setSimilarMovies(similarData.results);
        setReviews(reviewsData.results);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {movie === null ? (
        <NotFound />
      ) : loading ? (
        <Preloader />
      ) : (
        <>
          <section className="section section--no-indent movie-details">
            <div className="movie-details__backdrop">
              {movie.backdrop_path === null ? (
                <SVG src={placeholder} />
              ) : (
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                  alt={movie.title}
                ></img>
              )}
            </div>
            <div className="container">
              <div className="movie-details__wrapper">
                <div className="movie-details__left-side">
                  <div className="movie-details__poster">
                    {movie.poster_path === null ? (
                      <SVG src={placeholder} />
                    ) : (
                      <img
                        src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
                        alt={movie.title}
                      ></img>
                    )}
                  </div>
                  <div className="movie-rating">
                    <span className="movie-rating__ico">
                      <SVG src={star} width={30} height={30} />
                    </span>
                    <div className="movie-rating__vote">
                      <div>
                        <span>{checkRating(movie.vote_average)}</span>/10
                      </div>
                      <div>{checkCount(movie.vote_count)}</div>
                    </div>
                  </div>
                </div>
                <div className="movie-details__content">
                  <div className="movie-details__headline">
                    <h1>
                      {movie.title}
                      {movie.release_date && (
                        <span> ({getYear(movie.release_date)}) </span>
                      )}
                    </h1>
                    <span>Original title: {movie.original_title}</span>
                  </div>

                  {(trailer || movie.imdb_id) && (
                    <div className="movie-details__action">
                      {trailer && (
                        <span className="btn" onClick={toggleTrailerModal}>
                          Watch trailer <SVG src={play} />
                        </span>
                      )}

                      {movie.imdb_id && (
                        <a
                          href={`https://www.imdb.com/title/${movie.imdb_id}`}
                          target="_blank"
                          className="movie-details__imdb"
                          rel="noreferrer"
                        >
                          <SVG src={icoIMDb} />
                        </a>
                      )}
                    </div>
                  )}

                  {movie.overview && (
                    <p className="movie-details__overview">{movie.overview}</p>
                  )}

                  <div className="movie-details__info">
                    <div className="movie-details__heading">
                      <h3>Details</h3>
                    </div>
                    <table>
                      <tbody>
                        {movie.genres.length > 0 && (
                          <tr>
                            <td>Genres</td>
                            <td>
                              <div className="genres">
                                {movie.genres.map((genre) => (
                                  <span className="genre" key={genre.id}>
                                    {genre.name}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                        {movie.tagline && (
                          <tr>
                            <td>Tagline</td>
                            <td>{movie.tagline}</td>
                          </tr>
                        )}
                        {crew.some(
                          (crewMember) => crewMember.job === "Director"
                        ) && (
                          <tr>
                            <td>Director</td>
                            <td>
                              {crew
                                .filter(
                                  (crewMember) => crewMember.job === "Director"
                                )
                                .map((crewMember) => (
                                  <span key={crewMember.credit_id}>
                                    {crewMember.name}
                                  </span>
                                ))}
                            </td>
                          </tr>
                        )}
                        {movie.release_date && (
                          <tr>
                            <td>Release date</td>
                            <td>{movie.release_date}</td>
                          </tr>
                        )}
                        <tr>
                          <td>Country of origin</td>
                          <td>{movie.origin_country}</td>
                        </tr>
                        {movie.release_date && (
                          <tr>
                            <td>Year</td>
                            <td>{getYear(movie.release_date)}</td>
                          </tr>
                        )}
                        {movie.original_language && (
                          <tr>
                            <td>Original language</td>
                            <td>{getLanguageName(movie.original_language)}</td>
                          </tr>
                        )}
                        <tr>
                          <td>Runtime</td>
                          <td>{movie.runtime} min</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {credits.length > 0 && (
                  <div className="movie-details__right-side">
                    <div className="movie-details__heading">
                      <h3>Cast & Crew</h3>
                      {credits.length > 6 && (
                        <button
                          className="show-all"
                          onClick={toggleCastCrewModal}
                        >
                          Show all <SVG src={icoRight} width={20} height={20} />
                        </button>
                      )}
                    </div>
                    <div className="people-block">
                      <ul className="people-list">
                        {credits.slice(0, 6).map((member) => (
                          <li
                            key={member.credit_id}
                            className="people-list__item"
                          >
                            <div className="cast-card">
                              <div
                                className={`cast-card__avatar ${
                                  member.profile_path === null ? "no-image" : ""
                                }`}
                              >
                                {member.profile_path === null ? (
                                  <SVG src={icoAvatar} />
                                ) : (
                                  <img
                                    src={`https://image.tmdb.org/t/p/original${member.profile_path}`}
                                    alt={member.name}
                                  ></img>
                                )}
                              </div>
                              <div className="cast-card__content">
                                <h6 className="cast-card__name">
                                  {member.name}
                                </h6>
                                {member.role === "cast" ? (
                                  <span className="cast-card__character">
                                    as {member.character}
                                  </span>
                                ) : (
                                  <span className="crew-card__job">
                                    {member.job}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                      {credits.length > 6 && (
                        <button
                          className="show-all"
                          onClick={toggleCastCrewModal}
                        >
                          Show all <SVG src={icoRight} width={20} height={20} />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {credits.length > 0 && (
                <Modal
                  show={modalCastCrewOpen}
                  onClose={toggleCastCrewModal}
                  title={"Cast & Crew"}
                >
                  <h3>Cast:</h3>
                  <ul className="people-list people-list--modal">
                    {cast.map((castMember) => (
                      <li
                        key={castMember.credit_id}
                        className="people-list__item"
                      >
                        <div className="cast-card">
                          <div
                            className={`cast-card__avatar ${
                              castMember.profile_path === null ? "no-image" : ""
                            }`}
                          >
                            {castMember.profile_path === null ? (
                              <SVG src={icoAvatar} />
                            ) : (
                              <img
                                src={`https://image.tmdb.org/t/p/original${castMember.profile_path}`}
                                alt={castMember.name}
                              />
                            )}
                          </div>
                          <div className="cast-card__content">
                            <h6 className="cast-card__name">
                              {castMember.name}
                            </h6>
                            <span className="cast-card__character">
                              as {castMember.character}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <h3>Crew:</h3>
                  <ul className="people-list people-list--modal">
                    {crew.map((crewMember) => (
                      <li
                        key={crewMember.credit_id}
                        className="people-list__item"
                      >
                        <div className="crew-card">
                          <div
                            className={`crew-card__avatar ${
                              crewMember.profile_path === null ? "no-image" : ""
                            }`}
                          >
                            {crewMember.profile_path === null ? (
                              <SVG src={icoAvatar} />
                            ) : (
                              <img
                                src={`https://image.tmdb.org/t/p/original${crewMember.profile_path}`}
                                alt={crewMember.name}
                              />
                            )}
                          </div>
                          <div className="crew-card__content">
                            <h6 className="crew-card__name">
                              {crewMember.name}
                            </h6>
                            <span className="crew-card__job">
                              {crewMember.job}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Modal>
              )}

              {/* Modal for showing the trailer */}
              {trailer && (
                <Modal
                  show={modalTrailerOpen}
                  onClose={toggleTrailerModal}
                  title={"Trailer"}
                >
                  <div className="video">
                    <iframe
                      title={trailer.id}
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      frameBorder="0"
                      allowFullScreen
                    />
                  </div>
                </Modal>
              )}
            </div>
          </section>

          {similarMovies.length > 0 && (
            <section className="section similar-movies">
              <div className="container">
                <div className="similar-movies__wrapper">
                  <div className="headline headline--mb-0">
                    <h2 className="headline__title">More like this</h2>
                    <p className="headline__subtitle">
                      Discover a selection of movies that share similar themes,
                      genres, or captivating stories to keep your entertainment
                      journey going.
                    </p>
                  </div>
                  <div className="swiper-slider__wrapper">
                    <div className="swiper-button-prev"></div>
                    <Swiper
                      className="swiper-slider"
                      slidesPerView={1}
                      spaceBetween={24}
                      freeMode={true}
                      loop={true}
                      pagination={{
                        el: ".swiper-pagination",
                        clickable: true,
                      }}
                      navigation={{
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }}
                      modules={[Pagination, Navigation]}
                      breakpoints={{
                        480: {
                          slidesPerView: 2,
                        },
                        767: {
                          slidesPerView: 3,
                        },
                        1023: {
                          slidesPerView: 4,
                        },
                        1199: {
                          slidesPerView: 5,
                        },
                      }}
                    >
                      {similarMovies.slice(0, 10).map((similarMovie) => (
                        <SwiperSlide key={similarMovie.id}>
                          <Link
                            key={similarMovie.id}
                            to={`/movie/${similarMovie.id}`}
                            className="card"
                          >
                            <div
                              className={`card__img ${
                                similarMovie.poster_path === null
                                  ? "no-image"
                                  : ""
                              }`}
                            >
                              {similarMovie.poster_path === null ? (
                                <SVG src={placeholder} />
                              ) : (
                                <img
                                  src={`https://image.tmdb.org/t/p/w780${similarMovie.poster_path}`}
                                  alt={capitalizeWords(similarMovie.title)}
                                ></img>
                              )}
                            </div>
                            <div className="card__title">
                              <h6 className="title">
                                {capitalizeWords(similarMovie.title)}
                              </h6>
                            </div>
                            <div className="card__info">
                              <span>
                                <SVG src={star} width={15} height={15} />
                                {checkRating(similarMovie.vote_average)}
                              </span>
                            </div>
                          </Link>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-pagination"></div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {reviews.length > 0 && (
            <section className="section reviews">
              <div className="container">
                <div className="headline">
                  <h2 className="headline__title">Reviews</h2>
                  <p className="headline__subtitle">
                    Read what others are saying about this film, including
                    detailed critiques, personal opinions, and insights to help
                    you dive deeper into its story and impact.
                  </p>
                </div>
                <ul className="reviews-list">
                  {reviews.map((review) => (
                    <li key={review.id} className="reviews-list__item">
                      <div className="review">
                        <div
                          className={`review__avatar ${
                            review.author_details.avatar_path === null
                              ? "no-image"
                              : ""
                          }`}
                        >
                          {review.author_details.avatar_path === null ? (
                            <SVG src={icoAvatar} />
                          ) : (
                            <img
                              src={`https://image.tmdb.org/t/p/original${review.author_details.avatar_path}`}
                              alt={review.author}
                            ></img>
                          )}
                        </div>
                        <div className="review__content">
                          <div className="review__header">
                            <h6 className="review__author">{review.author}</h6>
                            <span className="review__date">
                              {formatDate(review.created_at)}
                            </span>
                          </div>
                          <div className="review__text">{review.content}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}

export { MovieDetails };
