const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET, NODE_ENV } = process.env;

const SALT_ROUNDS = 10;

const { SUCCESS } = require('../utils/constants');
const { CREATED } = require('../utils/constants');

const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');

// Создание пользователя
const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.status(CREATED).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
        return;
      }
      if (err.code === 11000) {
        next(new Conflict('Пользователь с таким имейлом уже существует'));
        return;
      }
      next(err);
    });
};

// Sign in(логин) пользователя по мейлу и паролю
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      const greeting = `Welcome back, ${user.name}!`;
      res.send({ token, greeting });
    })
    .catch(next);
};

// Получение аутентифицированного пользователя
const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(SUCCESS).send(user))
    .catch(next);
};

// Редактирование пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFound('Пользователь по заданному id отсутствует в базе'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        const validationErrors = Object.values(err.errors).map((error) => error.message);
        next(new BadRequest(validationErrors));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser, login, getMe, updateUser,
};

// const updateUser = (req, res, next) => {
//   const { name, email } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
//     .orFail(new NotFound('Пользователь не найден'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.ValidationError
//         || err instanceof mongoose.Error.CastError) {
//         next(new BadRequest('Переданы некорректные данные при редактировании'));
//       } else
//         if (err.code === 11000) {
//           next(new Conflict('Пользователь с таким имейлом уже существует'));
//         } else {
//           next(err);
//         }
//     });
// };
// function createUser(req, res, next) {
//   const { name, email, password } = req.body;
//   bcrypth.hash(password, 10)
//     .then((hash) => User.create({
//       email,
//       password: hash,
//       name,
//     }))
//     .then((user) => res.send({
//       name: user.name,
//       email: user.email,
//       _id: user._id,
//     }))
//     .catch((err) => {
//       if (err.code === 11000) {
//         next(new ConfilctError('Пользователь с таким электронным адресом уже зарегистрирован'));
//       } else if (err.name === 'ValidationError') {
//         next(new BadRequestError('Переданы некорректные данные пользователя'));
//       } else {
//         next(err);
//       }
//     });
// }

// function login(req, res, next) {
//   const { email, password } = req.body;
//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       if (!email || !password) {
//         return next(new BadRequestError('Неправильные почта или пароль'));
//       }
//       const token = jwt.sign({
//  _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
//       return res.send({ token });
//     })
//     .catch(next);
// }

// function getCurrentUser(req, res, next) {
//   const { _id } = req.user;
//   User
//     .findById(_id).then((user) => {
//       if (!user) {
//         return next(new NotFoundError('Пользователь с таким id не найден'));
//       }
//       return res.send(user);
//     }).catch(next);
// }

// function updateUser(req, res, next) {
//   const { name, email } = req.body;
//   User.findByIdAndUpdate(
//     req.user._id,
//     { name, email },
//     { new: true, runValidators: true },
//   ).then((user) => {
//     res.send(user);
//   }).catch((err) => {
//     if (err.name === 'ValidationError' || err.name === 'CastError') {
//       next(new BadRequestError(
// 'Переданы некорректные данные при обновлении профиля пользователя'));
//     }
//     return next(err);
//   });
// }

// module.exports = {
//   createUser, login, getCurrentUser, updateUser,
// };

// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const { mongoose } = require('mongoose');
// const User = require('../models/user');

// const BadRequest = require('../errors/BadRequest');
// const NotFound = require('../errors/NotFound');
// const ConflictingRequest = require('../errors/ConflictingRequest');

// const { JWT_SECRET } = require('../appConfig');

// module.exports.signUp = (req, res, next) => {
//   const {
//     name, email, password,
//   } = req.body;

//   bcrypt.hash(password, 10)
//     .then((hash) => User.create({
//       name, email, password: hash,
//     }))
//     .then((user) => {
//       const newUser = user.toObject();
//       delete newUser.password;
//       res.status(201).send(newUser);
//     })
//     .catch((err) => {
//       if (err instanceof mongoose.Error.ValidationError) {
//         next(new BadRequest('Переданы некорректные данные при создании пользователя'));
//         return;
//       }
//       if (err.code === 11000) {
//         next(new ConflictingRequest('Такой пользователь уже существует'));
//         return;
//       }
//       next(err);
//     });
// };

// module.exports.signIn = (req, res, next) => {
//   const { email, password } = req.body;

//   return User.findUserByCredentials(email, password)
//     .then((user) => {
//       const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '1d' });
//       res.send({ token });
//     })
//     .catch(next);
// };

// module.exports.getMe = (req, res, next) => {
//   User.findById(req.user._id)
//     .then((user) => {
//       if (user) {
//         res.send(user);
//       } else {
//         next(new NotFound('Пользователь не найден'));
//       }
//     })
//     .catch((err) => next(err));
// };

// module.exports.editUserInfo = (req, res, next) => {
//   const { name, email } = req.body;
//   User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
//     .orFail(new NotFound('Пользователь не найден'))
//     .then((user) => res.send(user))
//     .catch((err) => {
//       if (err instanceof mongoose.Error.ValidationError
//       || err instanceof mongoose.Error.CastError) {
//         next(new BadRequest('Переданы некорректные данные при обновлении профиля'));
//       } else
//       if (err.code === 11000) {
//         next(new ConflictingRequest('Этот email уже занят'));
//       } else {
//         next(err);
//       }
//     });
// };
