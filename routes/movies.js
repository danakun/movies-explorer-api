const router = require('express').Router();

const {
  getMovies, addMovie, deleteMovie,
} = require('../controllers/movies');
const {
  validateAddMovie, validateId,
} = require('../middlewares/validations');
// # возвращает все сохранённые текущим пользователем фильмы
router.get('/movies', getMovies);
// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
router.post('/movies', validateAddMovie, addMovie);
// # удаляет сохранённый фильм по id
router.delete('/movies/:movieId', validateId, deleteMovie);

module.exports = router;
