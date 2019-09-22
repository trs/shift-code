const codes = require('./codes');
const login = require('./login');
const redeem = require('./redeem');

module.exports = {
  ...codes,
  ...login,
  ...redeem
};
