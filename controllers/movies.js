const Movie = require('../models/movie');

const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const AccessForbidden = require('../errors/AccessForbidden');

const { SUCCESS } = require('../utils/constants');
// const { CREATED } = require('../utils/constants');

// # возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      if (!movies || movies.length === 0) {
        res.send('Сохраненных фильмов не найдено');
      }
      return res.status(SUCCESS).send(movies);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

// # удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFound('Такой фильм не найден'))
    .then((movie) => {
      // Если не равны id owner и user, запрещаем удаление
      if (req.user._id !== movie.owner._id.toString()) {
        next(new AccessForbidden('Нельзя удалить чужой фильм!'));
        return;
      }
      Movie.findByIdAndRemove(movieId)
        .then(() => res.send(movie))
        .catch((err) => next(err));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = {
  getMovies, addMovie, deleteMovie,
};
