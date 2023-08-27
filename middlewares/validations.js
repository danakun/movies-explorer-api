const { Joi, celebrate } = require('celebrate');
const { isMail } = require('../utils/constants');
const validator = require('validator');

// sign up validation
const validateSignUp = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Поле name должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
  }),
});

// User login validation
const validateSignIn = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).required()
      .messages({
        'any.required': 'Поле name должно быть заполнено',
        'string.min': 'Поле должно иметь длину от 8 символов',
      }),
  }),
});

// User update validation редактирование профиля
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Поле должно иметь длину от 2 символов',
        'string.max': 'Поле должно иметь длину до 30 символов',
      }),
  }),
});

// Валидация добавления фильма
const validateAddMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    image: Joi.string().pattern(isMail).optional(),
    trailerLink: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Линк не валиден');
    })
      .messages({
        'string.required': 'Поле link должно быть заполнено',
      }),
    thumbnail: Joi.string().required().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Линк не валиден');
    })
      .messages({
        'string.required': 'Поле link должно быть заполнено',
      }),
  }),
});

// Валидация удаления фильма по id
const validateId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
});

module.exports = {
  validateSignUp,
  validateSignIn,
  validateUserUpdate,
  validateAddMovie,
  validateId,
};

// // User Validation
// const validateUser = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().min(2).max(30)
//       .messages({
//         'any.required': 'Поле name должно быть заполнено',
//         'string.min': 'Поле должно иметь длину от 2 символов',
//         'string.max': 'Поле должно иметь длину до 30 символов',
//       }),
//     about: Joi.string().min(2).max(30)
//       .message({
//         'any.required': 'Поле about должно быть заполнено',
//         'string.min': 'Поле должно иметь длину от 2 символов',
//         'string.max': 'Поле должно иметь длину до 30 символов',
//       }),
//   }),
// });

// // Avatar Validation
// const validateAvatar = celebrate({
//   body: Joi.object().keys({
//     avatar: Joi.string().custom((value, helpers) => {
//       if (validator.isURL(value)) {
//         return value;
//       }
//       return helpers.message('Линк на аватар не валиден');
//     }),
//   }),
// });

// // Card Validation
// const validateCard = celebrate({
//   body: Joi.object().keys({
//     name: Joi.string().required().min(2).max(30)
//       .messages({
//         'string.required': 'Поле name должно быть заполнено',
//         'string.min': 'Поле должно иметь длину от 2 символов',
//         'string.max': 'Поле должно иметь длину до 30 символов',
//       }),
//     link: Joi.string().required().custom((value, helpers) => {
//       if (validator.isURL(value)) {
//         return value;
//       }
//       return helpers.message('Линк не валиден');
//     })
//       .messages({
//         'string.required': 'Поле link должно быть заполнено',
//       }),
//   }).unknown(true),
// });

// const validateLikes = celebrate({
//   params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
// });

// module.exports = {
//   validateId,
//   validateUser,
//   validateAvatar,
//   validateCard,
//   validateLogin,
//   validateSignUp,
//   validateLikes,
//   validateCardId,
// };

// const signIn = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//   }),
// });

// const singUp = celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required(),
//     name: Joi.string().required().min(2).max(30),
//   }),
// });

// // user id Validation
// const validateId = celebrate({
//   params: Joi.object().keys({
//     userId: Joi.string().length(24).hex().required(),
//   }),
// });
// // card id validation
// const validateCardId = celebrate({
//   params: Joi.object().keys({ cardId: Joi.string().length(24).hex() }),
// });

// thumbnail: Joi.string().custom((value) => {
// if (!validator.isURL(value, { require_protocol: true })) {
//   throw new BadRequest('Не правильный URL');
// }
// return value;
