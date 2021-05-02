const randomNumber = require('random-number');

const generateRandomNumber = () =>
  randomNumber({
    min: 10000,
    max: 1000000000000000000,
    integer: true,
  });

module.exports = generateRandomNumber;
