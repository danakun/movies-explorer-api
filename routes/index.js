const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');

const NotFound = require('../errors/NotFound');
const auth = require('../middlewares/auth');
const { createUser, login } = require('../controllers/users');
const { validateSignUp, validateSignIn } = require('../middlewares/validations');

//  Обработка запросов на создание пользователя и логин - Open routes
// создаёт пользователя с переданными в теле данными
router.post('/signup', validateSignUp, createUser);
// возвращает JWT
router.post('/signin', validateSignIn, login);
//  Мидлвара аутентификации пользователя - Private routes
router.use(auth);
// Обработка запросов пользователя
router.use('/', userRouter);
// // Обработка запросов фильмов
router.use('/', movieRouter);
// Обработка запросов несуществующих маршрутов
router.use('*', (req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;

// # возвращает информацию о пользователе (email и имя)
// GET /users/me

// # обновляет информацию о пользователе (email и имя)
// PATCH /users/me

// # возвращает все сохранённые текущим пользователем фильмы
// GET /movies

// # создаёт фильм с переданными в теле
// # country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
// POST /movies

// # удаляет сохранённый фильм по id
// DELETE /movies/_id

// const router = require('express').Router();

// const authRouter = require('./auth');
// const userRouter = require('./users');
// const moviesRouter = require('./movies');

// const auth = require('../middlewares/auth');
// const NotFound = require('../errors/NotFound');

// router.use('/api/', authRouter);
// router.use(auth);
// router.use('/api/users', userRouter);
// router.use('/api/movies', moviesRouter);
// router.use('/*', (req, res, next) => {
//   next(new NotFound('Как ты тут оказался?'));
// });

// module.exports = router;
// const router = require('express').Router();
// const NotFoundError = require('../errors/NotFoundError');
// const { createUser, login } = require('../controllers/users');
// const {
//   singUp,
//   signIn,
// } = require('../middlewares/validations');
// const auth = require('../middlewares/auth');

// // open Routes
// router.post('/signup', singUp, createUser);
// router.post('/signin', signIn, login);

// // Private routes
// router.use(auth);
// router.use('/', require('./users'));
// router.use('/', require('./movies'));

// router.use((req, res, next) => {
//   next(new NotFoundError('Страница не найдена'));
// });
