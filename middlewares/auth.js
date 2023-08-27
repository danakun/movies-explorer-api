const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = require('../utils/jwt');
const { JWT_SECRET, NODE_ENV } = process.env;
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const errorMessage = 'Необходима авторизация';
  // Проверка авторизации
  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Unauthorized(`${errorMessage}(${authorization})!!!`));
  }

  const token = authorization.replace(bearer, '');

  let payload;

  try {
    // Верифицикация токена с помощью ключа
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (error) {
    return next(new Unauthorized('Необходимо авторизироваться'));
  }
  req.user = payload; // Данные пользователя передаются в объект запроса
  next();
  return null;
};

module.exports = auth;

// const jwt = require('jsonwebtoken');

// const UnauthorizedError = require('../errors/UnauthorizedError');
// const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/constants');

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   const bearer = 'Bearer ';

//   if (!authorization || !authorization.startsWith(bearer)) {
//     return next(new UnauthorizedError('Нужна авторизация'));
//   }

//   const token = authorization.replace(bearer, '');
//   let payload;

//   try {
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
//   } catch (err) {
//     throw next(new UnauthorizedError('Нужна авторизация'));
//   }

//   req.user = payload;

//   return next();
// };
