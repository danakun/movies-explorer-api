const rateLimit = require('express-rate-limit');

// Ограничитель запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
  message: 'Превышено количество запросов на сервер.',
});

module.exports = limiter;
