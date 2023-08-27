const SUCCESS = 200;
const CREATED = 201;

const isMail = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

module.exports = {
  SUCCESS,
  CREATED,
  isMail,
};
