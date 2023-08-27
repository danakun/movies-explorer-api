require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');
const errorHandler = require('./middlewares/error-handler');

// Слушаем 3000 порт
const { PORT = 3000, DB_ADRESS = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

// Создание экземпляра приложения Express
const app = express();

// Подключаем корс
// вариант для кук
// app.use(cors({ origin: ['http://localhost:3001', 'https://danakun.nomoreparties.co'], credentials: true, maxAge: 30 }));
app.use(cors());

// Подключаем защиту заголовков
app.use(helmet());
// Подключаем базу данных монго
mongoose.connect(DB_ADRESS) // прописать переменную DB_ADRESS
  .then(() => {
    console.log('база данных подключена');
  })
  .catch(() => {
    console.log('Не удается подключиться к базе данных');
  });

app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));   -подключение статичного фронта
// Подключение логгера запросов
app.use(requestLogger);
// Подключение краш теста
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
// Подключаем rate-limiter
app.use(limiter);
// Подключение маршрутов, которым авторизация нужна
app.use(router);
// Подключение логгера ошибок
app.use(errorLogger);
// define errors, обработчик ошибок celebrate
app.use(errors());
// централизированный обработчик ошибок
app.use(errorHandler);
// консоль покажет, какой порт приложение слушает
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
