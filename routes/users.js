const router = require('express').Router();

const { getMe, updateUser } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validations');

// # возвращает информацию о пользователе (email и имя)
router.get('/users/me', getMe);
// # обновляет информацию о пользователе (email и имя)
router.patch('/users/me', validateUserUpdate, updateUser);

module.exports = router;
